const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const ValidateEventInput = require('./validate/event');

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

    type User {
      _id: ID!
      email: String!
      password: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!,
      password: String!,
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput!): Event
      createUser(userInput: UserInput!): User
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
      const { errors, isValid } = ValidateEventInput(args.eventInput);
      if (!isValid) {
        // eslint-disable-next-line no-throw-literal
        throw JSON.stringify(errors);
      }
      const event = new Event({
        ...args.eventInput,
        date: new Date(args.eventInput.date),
        creator: '5c3f7b7bbf8d1d815c0b6cf2',
      });
      let eventCreated = null;
      try {
        eventCreated = await event.save();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        errors.err = err.message;
        // eslint-disable-next-line no-throw-literal
        throw JSON.stringify(errors);
      }
      let user = null;
      try {
        user = await User.findById('5c3f7b7bbf8d1d815c0b6cf2');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        errors.err = err.message;
        // eslint-disable-next-line no-throw-literal
        throw JSON.stringify(errors);
      }
      if (!user) {
        errors.err = 'User not found.';
        // eslint-disable-next-line no-throw-literal
        throw JSON.stringify(errors);
      }
      user.createdEvents.push(eventCreated);
      let userUpdated = null;
      try {
        userUpdated = await user.save();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        errors.err = err.message;
        // eslint-disable-next-line no-throw-literal
        throw JSON.stringify(errors);
      }
      if (!userUpdated) {
        errors.err = 'Event can\'t created.';
        // eslint-disable-next-line no-throw-literal
        throw JSON.stringify(errors);
      }
      return eventCreated;
    },
    createUser: async (args) => {
      let userExisted = null;
      try {
        userExisted = await User.findOne({ email: args.userInput.email });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      }
      if (userExisted) {
        throw new Error('User exists already.');
      }

      let hashedPassword = null;
      try {
        hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      }
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      let userCreated = null;
      try {
        userCreated = await user.save();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw err;
      }
      return {
        _id: userCreated.id,
        email: userCreated.email,
        password: 'null',
      };
    },
  },
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
