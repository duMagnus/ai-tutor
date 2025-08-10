require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

const db = admin.firestore();

app.get('/stream', async (req, res) => {
  const prompt = req.query.prompt;
  const apiKey = process.env.OPENAI_API_KEY || (functions.config().openai && functions.config().openai.key);
  if (!apiKey) {
    res.status(500).send('OpenAI API key missing');
    return;
  }
  if (!prompt) {
    res.status(400).send('Prompt is required.');
    return;
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  try {
    const openai = new OpenAI({ apiKey });
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um tutor amigável para crianças brasileiras.' },
        { role: 'user', content: prompt }
      ],
      stream: true,
    });
    let buffer = ''; // Buffer to accumulate chunks
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        buffer += content;
        res.write(`data: ${encodeURIComponent(content)}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: [ERROR] ${error.message}\n\n`);
    res.end();
  }
});

app.post('/api/signup', async (req, res) => {
  const { email, password, role, inviteCode } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    let parentId = null;
    let parentInviteCode = undefined;
    if (role === 'parent') {
      // Generate a unique invite code for the parent using uuid
      parentInviteCode = uuidv4();
    }
    if (role === 'child') {
      // Validate invite code: find parent with this code
      const parentSnap = await db.collection('users')
        .where('role', '==', 'parent')
        .where('inviteCode', '==', inviteCode)
        .limit(1)
        .get();
      if (parentSnap.empty) {
        await admin.auth().deleteUser(userRecord.uid); // cleanup
        return res.status(400).json({ message: 'Invalid invite code' });
      }
      parentId = parentSnap.docs[0].id;
    }
    // Store user in Firestore
    try {
      await db.collection('users').doc(userRecord.uid).set({
        email,
        role,
        parentId,
        inviteCode: role === 'parent' ? parentInviteCode : null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (dbError) {
      await admin.auth().deleteUser(userRecord.uid);
      return res.status(500).json({ message: 'Failed to save user to database. Account has been removed.' });
    }
    return res.status(201).json({ message: 'Signup successful', inviteCode: parentInviteCode });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.get('/api/userinfo', async (req, res) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ message: 'Missing uid' });
  }
  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { role, inviteCode } = userDoc.data();
    return res.status(200).json({ role, inviteCode });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get('/api/parent/children', async (req, res) => {
  const { parentUid } = req.query;
  if (!parentUid) {
    return res.status(400).json({ message: 'Missing parentUid' });
  }
  try {
    // Find children with parentId == parentUid
    const childrenSnap = await admin.firestore().collection('users')
      .where('parentId', '==', parentUid)
      .where('role', '==', 'child')
      .get();
    const children = [];
    for (const doc of childrenSnap.docs) {
      const data = doc.data();
      // Example: fetch progress metrics (stub, replace with real metrics if available)
      // You can extend this to fetch from a 'progress' collection if needed
      children.push({
        uid: doc.id,
        email: data.email,
        name: data.name || '',
        progress: data.progress || 0, // percent complete
        timeSpent: data.timeSpent || 0 // minutes
      });
    }
    return res.status(200).json({ children });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/generateCurriculum', async (req, res) => {
  try {
    const { parentId, childId, subject, ageRange } = req.body;
    if (!parentId || !childId || !subject || !ageRange) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const prompt = `You are an expert educational planner. Create a curriculum for the subject: ${subject}.

Follow this structure:
1. Title: A very short, clear title for the curriculum (max 5 words).
2. Overview: Briefly describe the subject and its importance for the child's age group.
3. Learning Objectives: List 3-5 clear, age-appropriate objectives for the curriculum.
4. Key Concepts: List the main concepts or skills to be covered.
5. Lesson Breakdown: Divide the curriculum into 4-8 lessons/modules. For each lesson, provide:
   - Title
   - Description
   - Learning goals
   - Suggested activities/exercises
6. Assessment: Suggest ways to assess the child's understanding (quizzes, projects, etc).
7. Additional Resources: Recommend further reading, videos, or interactive materials (if relevant).

Return the result as a JSON object with the following fields: title, overview, objectives, keyConcepts, lessons, assessment, resources. All content must be in Portuguese and suitable for Brazilian children aged ${ageRange}.`;
    const apiKey = process.env.OPENAI_API_KEY || (functions.config().openai && functions.config().openai.key);
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });
    let rawContent = response.choices[0].message.content;
    // Log raw response for debugging
    console.log('Raw AI response:', rawContent);
    // Sanitize: Remove markdown code block if present
    let curriculumJson;
    try {
      // Remove triple backticks and optional "json" label
      rawContent = rawContent.replace(/^```json[\r\n]+|^```[\r\n]+|```$/gm, '').trim();
      curriculumJson = JSON.parse(rawContent);
    } catch (e) {
      console.error('Failed to parse curriculum JSON:', rawContent);
      return res.status(500).json({ error: 'Failed to parse curriculum JSON from AI.', raw: rawContent });
    }
    const docRef = admin.firestore().collection('curricula').doc();
    await docRef.set({
      parentId,
      childId,
      subject,
      ageRange,
      title: curriculumJson.title,
      overview: curriculumJson.overview,
      objectives: curriculumJson.objectives,
      keyConcepts: curriculumJson.keyConcepts,
      lessons: curriculumJson.lessons,
      assessment: curriculumJson.assessment,
      resources: curriculumJson.resources,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending_review',
    });
    res.status(200).json({ curriculumId: docRef.id, ...curriculumJson });
  } catch (error) {
    console.error('Error generating curriculum:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/approveCurriculum', async (req, res) => {
  const { curriculumId, parentId, childId } = req.body;
  if (!curriculumId || !parentId || !childId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const curriculumRef = db.collection('curricula').doc(curriculumId);
    await curriculumRef.update({
      status: 'approved',
      approvedBy: parentId,
      assignedTo: childId,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // Optionally, add reference to child document
    const childRef = db.collection('users').doc(childId);
    await childRef.update({
      assignedCurriculum: admin.firestore.FieldValue.arrayUnion(curriculumId)
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error approving curriculum:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/requestCurriculumChanges', async (req, res) => {
  const { curriculumId, parentId, changeRequest } = req.body;
  if (!curriculumId || !parentId || !changeRequest) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    // Fetch the previous curriculum from Firestore
    const curriculumDoc = await db.collection('curricula').doc(curriculumId).get();
    if (!curriculumDoc.exists) {
      return res.status(404).json({ error: 'Curriculum not found.' });
    }
    const previousCurriculum = curriculumDoc.data().curriculum;
    // Prepare prompt for LLM
    const prompt = `Você é um planejador educacional especialista. Aqui está o currículo anterior:\n\n${previousCurriculum}\n\nO responsável solicitou as seguintes mudanças:\n${changeRequest}\n\nPor favor, gere uma nova versão do currículo, incorporando as mudanças solicitadas. Mantenha o mesmo formato e estrutura, em português.`;
    // Call OpenAI using the official library
    const apiKey = process.env.OPENAI_API_KEY || (functions.config().openai && functions.config().openai.key);
    const { OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const newCurriculum = response.choices[0].message.content;
    // Update Firestore with the new curriculum
    await db.collection('curricula').doc(curriculumId).update({
      curriculum: newCurriculum,
      status: 'pending_review',
      changeRequestedBy: parentId,
      changeRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastChangeRequest: changeRequest,
    });
    return res.status(200).json({ success: true, curriculum: newCurriculum });
  } catch (error) {
    console.error('Error updating curriculum with LLM:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/cancelCurriculum', async (req, res) => {
  const { curriculumId, parentId } = req.body;
  if (!curriculumId || !parentId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    await db.collection('curricula').doc(curriculumId).delete();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting curriculum:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/child/approvedCurricula', async (req, res) => {
  try {
    const { childId } = req.query;
    if (!childId) {
      return res.status(400).json({ error: 'childId is required' });
    }
    const snapshot = await db.collection('curricula')
      .where('childId', '==', childId)
      .where('status', '==', 'approved')
      .get();
    const curricula = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ curricula });
  } catch (error) {
    console.error('Error fetching approved curricula for child:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Session and lesson management for AI tutoring
app.post('/api/subject/session', async (req, res) => {
  // Start or fetch a tutoring session for a child and subject
  const { childId, curriculumId, subjectName } = req.body;
  if (!childId || !curriculumId || !subjectName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    // Try to find an existing session
    const sessionSnap = await db.collection('sessions')
      .where('childId', '==', childId)
      .where('curriculumId', '==', curriculumId)
      .limit(1)
      .get();
    let sessionDoc;
    if (!sessionSnap.empty) {
      sessionDoc = sessionSnap.docs[0];
      return res.status(200).json({ sessionId: sessionDoc.id, ...sessionDoc.data() });
    }
    // If not found, create a new session
    const newSession = {
      childId,
      curriculumId,
      subjectName,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      currentLesson: 0,
      completedLessons: [],
      chatHistory: [],
      status: 'active',
    };
    const docRef = await db.collection('sessions').add(newSession);
    return res.status(201).json({ sessionId: docRef.id, ...newSession });
  } catch (error) {
    console.error('Error starting/fetching session:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/subject/progress', async (req, res) => {
  // Update lesson progress and chat history for a session
  const { sessionId, currentLesson, completedLessons, chatHistory } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId.' });
  }
  try {
    const update = {};
    if (currentLesson !== undefined) update.currentLesson = currentLesson;
    if (completedLessons !== undefined) update.completedLessons = completedLessons;
    if (chatHistory !== undefined) update.chatHistory = chatHistory;
    await db.collection('sessions').doc(sessionId).update(update);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating session progress:', error);
    return res.status(500).json({ error: error.message });
  }
});

exports.llmHandler = functions.https.onRequest(app);
