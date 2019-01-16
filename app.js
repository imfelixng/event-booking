const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();


app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput!): Event
    }

    schema {
      query: RootQuery,
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: async () => {
      let events = [];
      try {
        events = await Event.find();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      }
      return events;
    },
    createEvent: async (args) => {
      const event = new Event({
        ...args.eventInput,
        date: new Date(args.eventInput.date),
      });
      let eventSaved = null;
      try {
        eventSaved = await event.save();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      }
      return eventSaved;
    },
  },
  graphiql: true,
}));

mongoose.connect('mongodb://localhost:27017/event-booking-db',
  {
    useNewUrlParser: true,
    useFindAndModify: false,
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
