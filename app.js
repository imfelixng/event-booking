const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to my website');
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running at port 3000');
});
