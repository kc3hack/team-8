const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('firebase-admin');
const paths = require('./paths.json');

function seek(/*object*/ obj, /*string*/ tag) {
  // 自分 (obj) が tag で指定されているか確認
  if (obj.tag === tag) return obj;

  // 子要素のどれかが tag で指定されているか確認
  if ('child' in obj) {
    for (let i = 0; i < obj.child.length; i++) {
      const result = seek(obj.child[i], tag);
      if (result !== null) return result;
    }
    return null;
  }

  // ヒットしなかった
  return null;
}

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
        case 'テスト3':
          category(event);
          break;
      }
      return;
    }

    if (event.type === 'postback') {
      const eventPostbackData = event.postback.data;
      reply(event, {
        messages: [{
          type: 'text',
          text: eventPostbackData === 'food'
                ? foodCategory(event)
                : (eventPostbackData === 'spot'
                  ? spotCategory(event)
                  : (eventPostbackData === 'otherFood'
                    ? otherFoodCategory(event)
                    : (eventPostbackData === 'flour'
                      ? 'たこ焼きです。'
                      : (eventPostbackData === 'sweet'
                        ? 'スイーツです。'
                        : (eventPostbackData === 'otherOtherFood' //和食とかアジア
                          ? otherOtherFoodCategory(event)
                          : (eventPostbackData === 'meat'
                            ? meatCategory(event)
                            : (eventPostbackData === 'fish'
                              ? fishCategory(event)
                              : (eventPostbackData === 'sushi'
                                ? '寿司です。'
                                : (eventPostbackData === 'sashimi'
                                  ? '海鮮です。'
                                  : (eventPostbackData === 'sightseeing'
                                    ? sightseeingCategory(event)
                                    : (eventPostbackData === 'leisure'
                                      ? leisureCategory(event)
                                      : (eventPostbackData === 'shopping'
                                        ? 'ショッピングです。'
                                        : (eventPostbackData === 'history'
                                          ? historyCategory(event)
                                          : '選択しました。'
                                //         : (eventPostbackData === 'walk'
                                //           ? walkCategory(event)
                                //           : (eventPostbackData === 'display'
                                //             ? displayCategory(event)
                                //             : (eventPostbackData === 'outdoor'
                                //               ? outdoorCategory(event)
                                //               : (eventPostbackData === 'amusement'
                                //                 ? amusementCategory(event)
                                //                 : (eventPostbackData === 'view'
                                //                   ? viewCategory(event)
                                //                   : (eventPostbackData === 'area'
                                //                     ? areaCategory(event)
                                //                     : (eventPostbackData === 'animal'
                                //                       ? animalCategory(event)
                                //                       : (eventPostbackData === 'mountain'
                                //                         ? mountainCategory(event)
                                                        // : '選択しました。'
                                //                         )
                                //                       )
                                //                     )
                                //                   )
                                //                 )
                                //               )
                                //             )
                                          // )
                                        // )
                                      // )
                                      )
                                    )
                                  )
                                )
                              )
                            )  
                          )
                        )
                      )
                    )
                  )
                )

        }]
      })
/*
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
        case 'snack':
          text = '軽食です。';
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
*/
     
      /*  
      reply(event, {
        messages: [{
          type: 'text',
          text: text
        }]
      })

      for (let i = 0; i < paths.length; i ++) {
        const result = seek(paths[i], eventPostbackData);
        if (result !== null) {
          generateTemplate(event, result);
          return;
        }
        if (i === paths.length - 1) {
          console.error('不正な postback です');
          return;
        }
      }
      */
    }
  }
});

/*
console.log(JSON.stringify(paths[0].child.map(item => {
  //console.log(item);
  return {
    thumbnailImageUrl: item.image,
    title: item.title,
    text: item.text,
    actions: [{
      type: 'postback',
      label: '選択',
      data: item.tag
    }]
  };
})));
*/

/*
console.log(JSON.stringify([
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
]));
*/

// function generateTemplate(event, obj) {
//   if ('child' in obj) {
//     // 質問する
//     const request = {
//       messages: [{
//         type: 'template',
//         altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
//         template: {
//           type: 'carousel',
//           columns: obj.child.map(item => {
//             console.log(item);
//             return {
//               thumbnailImageUrl: item.image,
//               title: item.title,
//               text: item.text,
//               actions: [{
//                 type: 'postback',
//                 label: '選択',
//                 data: item.tag
//               }]
//             };
//           })
//         }
//       }]
//     };
//     reply(event, request);
//     return;
//   }

//   // 検索結果を発言する
// }

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
           text: '>お好み焼き、たこ焼き...etc',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'flour'
           }]
          },
          {
            thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550701408/lightFood.jpg',
            title: '軽食',
            text: '軽食',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'snack'
            }]
          },
          {
            thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550701359/sweets.jpg',
            title: 'スイーツ',
            text: 'ケーキ、和菓子...etc',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'sweet'
            }]
          }
          // ,
          // {
          //   thumbnailImageUrl: 'https://4.bp.blogspot.com/-7Yn9HIjxaVk/W5H_yHMZ9rI/AAAAAAABOvo/swKb6GUVdg89VKZuePfiUAQa9crZyta0QCLcBGAs/s180-c/food_moritsuke_good.png',
          //   title: 'その他',
          //   text: '>肉、魚、麺類、その他',
          //   actions: [{
          //     type: 'postback',
          //     label: '選択',
          //     data: 'otherFood'
          //   }]
          // }
        ]
      }
    }]
  })
}
// function otherFoodCategory(event) {
//   reply(event, {
//     messages: [{
//       type: 'template',
//       altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
//       template: {
//         type: 'carousel',
//         columns: [
//           {
//            thumbnailImageUrl: 'http://earth.publicdomainq.net/201705/19o/publicdomainq-0009201gwxpbl.jpg',
//            title: '肉',
//            text: '>ハンバーグ・ステーキ,焼肉,しゃぶしゃぶ・すき焼き',
//            actions: [{
//              type: 'postback',
//              label: '選択',
//              data: 'meat'
//            }]
//           },
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201601/12s/gahag-004510.jpg',
//             title: '魚',
//             text: '>寿司、海鮮',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'sushi'
//             }]
//           },
//           {
//             thumbnailImageUrl: 'https://publicdomainq.net/images/201810/07s/publicdomainq-0027082.jpg',
//             title: '麺類',
//             text: '>うどん・そば、ラーメン',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'noodle'
//             }]
//           },
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201510/20s/gahag-001663.jpg',
//             title: 'その他',
//             text: '>和食、アジア、ヨーロッパ、その他',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'otherOtherFood'
//             }]
//           }
//         ]
//       }
//     }]
//   })
// }
// function meatCategory(event) {
//   reply(event, {
//     messages: [{
//       type: 'template',
//       altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
//       template: {
//         type: 'carousel',
//         columns: [
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201512/25s/gahag-003990.jpg',
//             title: 'ハンバーグ・ステーキ',
//             text: 'ハンバーグ・ステーキ',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'steak'
//             }]
//           },
//           {
//             thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550701359/sweets.jpg',
//             title: '焼肉',
//             text: '焼肉',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'grilledMeat'
//             }]
//           },
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201510/24s/gahag-001783.jpg',
//             title: 'しゃぶしゃぶ・すき焼き',
//             text: 'しゃぶしゃぶ・すき焼き',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'sukiyaki'
//             }]
//           }
//         ]
//       }
//     }]
//   })
// }
// function fishCategory(event) {
//   reply(event, {
//     messages: [{
//       type: 'template',
//       altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
//       template: {
//         type: 'carousel',
//         columns: [
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201511/17s/gahag-002640.jpg',
//             title: '寿司',
//             text: '寿司',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'sushi'
//             }]
//           },
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201509/28s/gahag-000871.jpg',
//             title: '海鮮',
//             text: '海鮮',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'sashimi'
//             }]
//           }
//         ]
//       }
//     }]
//   })
// }
function spotCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: 'https://www.pakutaso.com/shared/img/thumb/syunsetuFTHG8406_TP_V1.jpg',
           title: '観光',
           text: '>歴史・文化、散策、お風呂・温泉',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'sightseeing'
           }]
          }
          // ,
          // {
          //   thumbnailImageUrl: 'https://cdn.pixabay.com/photo/2017/05/25/15/08/jogging-2343558__340.jpg',
          //   title: 'レジャー',
          //   text: '>展示、アウトドア・スポーツ、アミューズメント',
          //   actions: [{
          //     type: 'postback',
          //     label: '選択',
          //     data: 'leisure'
          //   }]
          // }
          ,
          {
            thumbnailImageUrl: 'https://cdn.pixabay.com/photo/2016/11/22/19/08/blur-1850082__340.jpg',
            title: 'ショッピング',
            text: 'ショッピング',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'shopping'
            }]
          }
        ]
      }
    }]
  })
}
function otherOtherFoodCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
           title: '和食',
           text: '和食',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'japan'
            }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
            title: 'アジア',
            text: 'アジア',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'country'
            }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
            title: 'ヨーロッパ',
            text: 'ヨーロッパ',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'europeana'
            }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
            title: 'その他',
            text: 'その他',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'lastOtherFood'
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
             data: 'history'
           }]
          },
          {
            thumbnailImageUrl: 'http://gahag.net/img/201605/25s/gahag-008967.jpg',
            title: '散策',
            text: '>景色、名所',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'walk'
            }]
          },
          {
            thumbnailImageUrl: 'https://www.pakutaso.com/shared/img/thumb/NGshingensen_TP_V1.jpg',
            title: 'お風呂・温泉',
            text: 'お風呂・温泉',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'bath'
            }]
          }
        ]
      }
    }]
  })
}
// function leisureCategory(event) {
//   reply(event, {
//     messages: [{
//       type: 'template',
//       altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
//       template: {
//         type: 'carousel',
//         columns: [
//           {
//             thumbnailImageUrl: 'https://images.unsplash.com/photo-1530263131525-1c1d26feaa60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80',
//             title: '展示',
//             text: '>生物、博物館、美術館',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'display'
//            }]
//           },
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201607/23s/gahag-0108929594-1.jpg',
//             title: 'アウトドア・スポーツ',
//             text: '>山、海・川、施設',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'outdoor'
//             }]
//           },
//           {
//             thumbnailImageUrl: 'http://gahag.net/img/201509/18s/gahag-0005343950-1.jpg',
//             title: 'アミューズメントパーク',
//             text: '>テーマパーク・体験・文芸',
//             actions: [{
//               type: 'postback',
//               label: '選択',
//               data: 'amusement',
//               displayText: 'アミューズメントパークを選択しました。'
//             }]
//           }
//         ]
//       }
//     }]
//   })
// }
function historyCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: 'http://gahag.net/img/201608/05s/gahag-011321.jpg',
           title: 'お城',
           text: 'お城',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'castle'
           }]
          },
          {
            'https://www.pakutaso.com/shared/img/thumb/kyotoIMGL6547_TP_V.jpg',
            title: '神社・寺',
            text: '神社,寺',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'shrine'
            }]
          },
          {
            thumbnailImageUrl: 'https://www.pakutaso.com/shared/img/thumb/008AME5031_TP_V.jpg',
            title: '遺跡・史跡',
            text: '遺跡,史跡',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'remain'
            }]
          },
          {
            'https://www.pakutaso.com/shared/img/thumb/NOU92_kyounomachiwonagameru_TP_V.jpg',
            title: 'その他',
            text: '歴史的建造物',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'odaNobunaga'
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
