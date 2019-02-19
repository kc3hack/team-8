const express = require('express');
const app = express();

const server = app.listen(3000, () => {
  console.log(`Node.js is listening to PORT: ${server.address().port}`);
});

app.get('/', (req, res, next) => {
  res.json('Hello World!');
});
