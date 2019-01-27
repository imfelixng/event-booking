const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const graphQLSchema = require('./graphql/schema');
const graphQLResolver = require('./graphql/resolvers');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(isAuth);

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
    console.log('Connected mongodb success');
  })
  .catch(err => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running at port 3000');
});
