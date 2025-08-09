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

app.post('/', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY || (functions.config().openai && functions.config().openai.key);
    if (!apiKey) {
      console.error('OpenAI API key missing');
      return res.status(500).send({ error: 'OpenAI API key missing' });
    }
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required.' });
    }
    try {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um tutor amigável para crianças brasileiras.' },
          { role: 'user', content: prompt }
        ],
        stream: false,
      });
      console.log('OpenAI completion:', JSON.stringify(completion));
      // Defensive: handle OpenAI response for frontend
      let llmText = 'Desculpe, não consegui responder.';
      if (completion && completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
        llmText = completion.choices[0].message.content;
      }
      res.status(200).send({ choices: [{ text: llmText }] });
    } catch (openaiError) {
      if (openaiError.response) {
        console.error('OpenAI API error:', openaiError.response.status, openaiError.response.data);
        res.status(500).send({ error: openaiError.response.data });
      } else {
        console.error('OpenAI API error:', openaiError.message);
        res.status(500).send({ error: openaiError.message });
      }
    }
  } catch (error) {
    console.error('LLM Handler Error:', error);
    res.status(500).send({ error: error.message });
  }
});

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
        res.write(`data: ${content}\n\n`); // Proper SSE format: each chunk ends with \n\n
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: [ERROR] ${error.message}\n\n`);
    res.end();
  }
});

exports.llmHandler = functions.https.onRequest(app);
