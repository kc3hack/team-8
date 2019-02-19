const channelAccessToken = 'xJDP5i5HkrbQjpMSuKErT0Djyp/r+OQxjjaNJ/H+bFbEP6esa/1bcKJr2eNilMeCy7jve90C0Pxf1CZrsoGvTigkOWzzJdAMuCyiWcDAyqtP0yk3467SAv+JXGQt3cgXUu8Dey2I0tZumMqeZ/TFdgdB04t89/1O/w1cDnyilFU=';

const express = require('express');
const app = express();
const axios = require('axios');

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Node.js is listening to PORT: ${server.address().port}`);
});

app.get('/', (req, res, next) => {
  res.json('Hello World!');
});

app.post('/webhook', (req, res, next) => {
  res.status(200).end();

  for (let event of req.body.events) {
    if (event.type === 'message' && event.message.text === 'ハロー') {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${channelAccessToken}`
      };
      const body = {
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: 'こんにちは'
        }]
      };
      const url = 'https://api.line.me/v2/bot/message/reply';
      axios.post(url, body, { headers });
    }
  }
});
