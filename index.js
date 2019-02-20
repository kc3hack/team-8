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
  // res.json('Hello World!');

});

app.post('/webhook', function (req, res, next) {
  res.status(200).end();

  for (let event of req.body.events) {
    if (event.type === 'message') {
      switch (event.message.text) {
        case 'テスト3':
          category(event);
          break;
      }
      return;
    }

    if (event.type === 'postback') {

      const eventPostbackData = event.postback.data;
      let text;

      switch (eventPostbackData) {
        case 'food':
          text = foodCategory(event);
          break;
        case 'spot':
          text = spotCategory(event);
          break;
        case 'flour':
          text = 'たこ焼きです。';
          break;
        case 'sweet':
          text = 'スイーツです。';
          break;
        case 'other':
          text = otherFoodCategory(event);
          break;
        case 'sightseeing':
          text = sightseeingCategory(event);
          break;
        case 'leisure':
          text = leisureCategory(event);
          break;
        case 'shopping':
          text = 'ショッピングです。'
          break;
        case 'history':
          text = historyCategory(event);
          break;
        case 'walk':
          text = walkCategory(event);
          break;
        case 'display':
          text = displayCategory(event);
          break;
        case 'outdoor':
          text = outdoorCategory(event);
          break;
        case 'amusement':
          text = amusementCategory(event);
          break;
        case 'view':
          text = viewCategory(event);
          break;
        case 'area':
          text = areaCategory(event);
          break;
        case 'animal':
          text = animalCategory(event);
          break;
        case 'mountain':
          text = mountainCategory(event);
          break;
        default:
          console.error(`不正な postback です: ${eventPostbackData}`);
          return;
      }

      reply(event, {
        messages: [{
          type: 'text',
          text
        }]
      });
    }
  }
});

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
              data: 'flour'
            }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/d7/d7204f6c5a25a9bde5ae435b7c3b1ee9_w.jpg',
            title: 'スイーツ',
            text: 'ケーキ、和菓子...etc',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'sweet'
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
              displayText: `観光`
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

function otherFoodCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '和食',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: '',
              displayText: '和食を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '中華',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: '',
              displayText: '中華を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function sightseeingCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://www.pakutaso.com/shared/img/thumb/NOU92_kyounomachiwonagameru_TP_V1.jpg',
            title: '歴史・文化',
            text: '>お城、神社・寺、遺跡・史跡、その他',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'history',
              displayText: '歴史・文化を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '散策',
            text: '>景色、名所',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'walk',
              displayText: '散策を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'お風呂・温泉',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'bath',
              displayText: 'お風呂・温泉を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function leisureCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '展示',
            text: '>生物、博物館、美術館',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'display',
              displayText: '展示を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'アウトドア・スポーツ',
            text: '>山、海・川、施設',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'outdoor',
              displayText: 'アウトドア・スポーツを選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'アミューズメントパーク',
            text: '>テーマパーク・体験・文芸',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'amusement',
              displayText: 'アミューズメントパークを選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function historyCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: 'お城',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'castle',
              displayText: 'お城を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: 'https://www.pakutaso.com/shared/img/thumb/kyotoIMGL6547_TP_V.jpg',
            title: '神社・寺',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'shrine',
              displayText: '神社・寺を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '遺跡・史跡',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'remain',
              displayText: '遺跡・史跡を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'その他',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'odaNobunaga',
              displayText: 'その他を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function walkCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '景色',
            text: '>景観・絶景、展望台・施設',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'view',
              displayText: '景色を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '名所',
            text: '>街並み、建築物、その他',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'area',
              displayText: '名所を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function displayCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '生物',
            text: '>動物園、水族館',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'animal',
              displayText: '生物を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '博物館',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'museum',
              displayText: '博物館を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '美術館',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'art',
              displayText: '美術館を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function outdoorCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '山',
            text: '>登山、キャンプ、スキー',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'moutain',
              displayText: '山を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '海・川',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'water',
              displayText: '海・川を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '施設',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'facility',
              displayText: '施設を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function amusementCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: 'テーマパーク',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'theme',
              displayText: 'テーマパークを選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '体験',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'eperience',
              displayText: '体験を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '文芸',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'culture',
              displayText: '文芸を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function viewCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '景観・絶景',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'gView',
              displayText: '景観・絶景を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '展望台・施設',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'outlook',
              displayText: '展望台・施設を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function areaCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '街並み',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'town',
              displayText: '街並みを選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '建築物',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'constraction',
              displayText: '建築物を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'その他',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'anotherArea',
              displayText: 'その他を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}

function animalCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '動物園',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'zoo',
              displayText: '動物園を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: '水族館',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'aqua',
              displayText: '水族館を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}
function mountainCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: '',
            title: '登山',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'climbing',
              displayText: '登山を選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'キャンプ',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'camp',
              displayText: 'キャンプを選択しました。'
            }]
          },
          {
            thumbnailImageUrl: '',
            title: 'スキー',
            text: '',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'ski',
              displayText: 'スキーを選択しました。'
            }]
          }
        ]
      }
    }]
  })
}
>>>>>>> 4605ef4181f7272c6b714545354ad3a34df9a889

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
