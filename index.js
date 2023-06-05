const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(bodyParser.text({ type: 'text/plain+base64' }));
app.use(express.static('static'));
app.use(express.json());
app.post('/bot/ask', async (req, res) => {
  //var body = JSON.parse(req.body);

  const encodedQuestion = req.body.question;
  const persona = req.body.persona;
  console.log('encodedQuestion:', encodedQuestion);
  const question = Buffer.from(encodedQuestion, 'base64').toString('utf-8');

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  };
  var messages = {};
  try {
    messages = req.body.messages;
  } catch { }
  console.log(messages);

  let basemsgs = [
     {
      'role': 'system',
      'content': persona,
    },
    {
      'role': 'user',
      'content': question + `\n(conversation history (in json) : ${messages})`,
    }

  ]
  // basemsgs.push(messages) 
  /* basemsgs.push( {
          'role': 'user',
          'content': question,
        })*/
  const json_data = {
    'messages': basemsgs,
    'stream': true,
    'model': 'gpt-3.5-turbo',
    'temperature': 0.5,
    'presence_penalty': 0,
    'max_tokens': 2048,
  };
  const prefixes = ["https://c.aigc.it",
    "https://c8.aigc.it",
    "https://c.did.fm",
    "https://c8.did.fm",
    "https://c.minapp.io",
    "https://c8.minapp.io",
    "https://c.dapp.cat",
    "https://c8.dapp.cat",
    "https://c.tokenhash.io",
    "https://c2.tokenhash.io"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)] 
    console.log("Using " + prefix) 
  const url = prefix + '/api/openai/v1/chat/completions'; 
  const request = await fetch(url, { 
    method: 'POST',
    headers: headers,
    body: JSON.stringify(json_data),
  });

  const response = await request.text();

  res.send(response);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});