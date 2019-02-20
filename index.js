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
        case 'テスト3':
          category(event);
          break;
      }
      return;
    }

    if (event.type === 'postback') {
      reply(event, {
        messages: [{
          type: 'text',
          text: event.postback.data === 'food'
              ? `好きな食べ物のカテゴリーを選んでください。${foodCategory(event)}`//変数が使えるか確認
              : (event.postback.data === 'spot'
                ? spotCategory(event)
                : (event.postback.data === 'flour'
                  ? 'たこ焼きです。'
                  : (event.postback.data === 'sweet'
                    ? 'ケーキです。'
                    : (event.postback.data === 'other'
                      ? 'その他です。'
                      : (event.postback.data === 'sightseeing'
                        ? '観光です。'
                        : (event.postback.data === 'leisure'
                          ? 'レジャーです。'
                          : 'ショッピングです。'
                          )
                        )
                      )
                    )  
                  )
                )
        }]
      });
    }
    // if (event.type === 'postback') {
    //   reply(event, {
    //     messages: [{
    //       type: 'text',
    //       text: event.postback.data === 'hana'
    //           ? '花「ありがとうございます。」'
    //           : (event.postback.data === 'hinata'
    //               ? 'ひなた「やったぁー！」'
    //               : '乃愛「でっしょー？私が世界で一番かわいい！」')
    //     }]
    //   });
    // }
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

function category(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
           title: '飲食',
           text: '>粉物,スイーツ,その他',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'food'
           }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/d7/d7204f6c5a25a9bde5ae435b7c3b1ee9_w.jpg',
            title: 'スポット',
            text: '>観光、レジャー',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'spot'
            }]
          }
        ]
      }
    }]
  })
}
function foodCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/9d/9d70d762fd1e29e3dc3a84b0469969bf_t.jpeg',
           title: '粉物',
           text: 'お好み焼き、たこ焼き...etc',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'flour',
             displayText: '粉物を選びました'
           }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/d7/d7204f6c5a25a9bde5ae435b7c3b1ee9_w.jpg',
            title: 'スイーツ',
            text: 'ケーキ、和菓子...etc',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'sweet',
              displayText: 'スイーツを選びました'
            }]
          },
          {
            thumbnailImageUrl: 'https://4.bp.blogspot.com/-7Yn9HIjxaVk/W5H_yHMZ9rI/AAAAAAABOvo/swKb6GUVdg89VKZuePfiUAQa9crZyta0QCLcBGAs/s180-c/food_moritsuke_good.png',
            title: 'その他',
            text: '>肉、魚、その他',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'other'
            }]
          }
        ]
      }
    }]
  })
}

function spotCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: '',
           title: '観光',
           text: '>歴史・文化、散策、お風呂・温泉',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'sightseeing',
             displayText: `${title}を選択しました。`//displayTextや変数が使えるか試し
           }]
          },
          {
            thumbnailImageUrl: '',
            title: 'レジャー',
            text: '>展示、アウトドア・スポーツ、アミューズメント',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'leisure',
              displayText: ''
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'ショッピング',
            text: '?',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'shopping',
              displayText: ''
            }]
          }
        ]
      }
    }]
  })
}
function templateCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: '',
           title: '',
           text: '',
           actions: [{
             type: 'postback',
             label: '選択',
             data: '',
             displayText: ''
           }]
          },
          {
            thumbnailImageUrl: '',
            title: '',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: '',
              displayText: ''
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: '',
              displayText: ''
            }]
          }
        ]
      }
    }]
  })
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
