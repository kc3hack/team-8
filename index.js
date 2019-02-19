const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.type,
    project_id: process.env.project_id,
    project_key_id: process.env.project_key_id,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_url: process.env.auth_url,
    token_url: process.env.token_url,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
  })
});

const db = admin.firestore();

const app = express();

app.use(bodyParser.json());

const server = app.listen(process.env.PORT, () => {
  console.log(`Node.js is listening to PORT: ${server.address().port}`);
});

app.get('/', (req, res, next) => {
  res.json('Hello World!');
});

app.post('/webhook', function (req, res, next) {
  res.status(200).end();

  for (let event of req.body.events) {
    if (event.type === 'message') {
      switch (event.message.text) {
        case 'ハロー':
          sayHello(event);
          break;
        case 'テスト':
          test(event);
          break;
        case 'テスト2':
          test2(event);
          break;
      }
      return;
    }

    if (event.type === 'postback') {
      reply(event, {
        messages: [{
          type: 'text',
          text: event.postback.data === 'hana'
              ? '花「ありがとうございます。」'
              : (event.postback.data === 'hinata'
                  ? 'ひなた「やったぁー！」'
                  : '乃愛「でっしょー？私が世界で一番かわいい！」')
        }]
      });
    }
  }
});

function sayHello(event) {
  reply(event, {
    messages: [{
      type: 'text',
      text: 'こんにちは'
    }]
  });
}

function test(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550587379/p_002.jpg',
            title: '白咲 花',
            text: 'しろさき はな',
            actions: [{
              type: 'postback',
              label: 'かわいい',
              data: 'hana'
            }]
          },
          {
            thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550587383/p_003.jpg',
            title: '星野 ひなた',
            text: 'ほしの ひなた',
            actions: [{
              type: 'postback',
              label: 'かわいい',
              data: 'hinata'
            }]
          },
          {
            thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550587388/p_004.jpg',
            title: '姫坂 乃愛',
            text: 'ひめさか のあ',
            actions: [{
              type: 'postback',
              label: 'かわいい',
              data: 'noa'
            }]
          }
        ]
      }
    }]
  });
}

async function test2(event) {
  try {
    const { docs } = await db.collection('pages').get();
    for (let doc of docs) {
      console.log(`Document ID: ${doc.id}`);
      console.log(doc.data());
    }
  } catch (e) {
    console.log(e);
  }
}

async function reply(event, body) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken: event.replyToken,
      ...body
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.channel_access_token}`
      }
    });
  } catch (e) {
    console.log(e);
  }
}
