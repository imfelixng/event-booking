const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolvers');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: graphQLSchema,
  rootValue: graphQLResolver,
  graphiql: true,
}));

mongoose.connect('mongodb://localhost:27017/event-booking-db',
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected mongodb success');
  })
  // eslint-disable-next-line no-console
  .catch(err => console.log(err));

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running at port 3000');
});
