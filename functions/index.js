require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

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
        console.log('OpenAI stream chunk:', JSON.stringify(content));
        buffer += content;
        // Also log the buffer to see the accumulated message
        console.log('OpenAI stream buffer:', JSON.stringify(buffer));
        // Send the chunk as-is, without escaping newlines
        // Use encodeURIComponent to ensure special characters are not lost, but decode on frontend
        res.write(`data: ${encodeURIComponent(content)}\n\n`);
      }
    }
    // After streaming, log the final buffer
    console.log('Final OpenAI stream buffer:', JSON.stringify(buffer));
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: [ERROR] ${error.message}\n\n`);
    res.end();
  }
});

exports.llmHandler = functions.https.onRequest(app);
