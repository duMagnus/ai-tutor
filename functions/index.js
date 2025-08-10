require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const admin = require('firebase-admin');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

if (!admin.apps.length) {
  admin.initializeApp();
}
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

exports.llmHandler = functions.https.onRequest(app);
