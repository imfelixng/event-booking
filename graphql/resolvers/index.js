const bcrypt = require('bcryptjs');

// eslint-disable-next-line import/no-unresolved
const Event = require('../../models/event');
// eslint-disable-next-line import/no-unresolved
const User = require('../../models/user');

// eslint-disable-next-line import/no-unresolved
const ValidateEventInput = require('../../validate/event');

const eventList = async (eventIDs) => {
  let events = [];
  try {
    events = await Event.find({ _id: { $in: eventIDs } });
  } catch (err) {
    throw err;
  }
  return events.map(async event => ({
    // eslint-disable-next-line no-underscore-dangle
    ...event._doc,
    // eslint-disable-next-line no-use-before-define
    creator: await userItem.bind(this, event.creator),
    date: new Date(event.date).toISOString(),
  }));
};

const userItem = async (userID) => {
  let user = null;
  try {
    user = await User.findById(userID);
  } catch (err) {
    throw err;
  }
  return {
    // eslint-disable-next-line no-underscore-dangle
    ...user._doc,
    createdEvents: await eventList.bind(this, user.createdEvents),
  };
};
module.exports = {
  events: async () => {
    let events = [];
    try {
      events = await Event.find().populate('creator');
    } catch (err) {
      throw err;
    }
    return events.map(async event => (
      {
        // eslint-disable-next-line no-underscore-dangle
        ...event._doc,
        creator: await userItem.bind(this, event.creator),
        date: new Date(event.date).toISOString(),
      }));
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
      errors.err = err.message;
      // eslint-disable-next-line no-throw-literal
      throw JSON.stringify(errors);
    }
    let user = null;
    try {
      user = await User.findById('5c3f7b7bbf8d1d815c0b6cf2');
    } catch (err) {
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
      errors.err = err.message;
      // eslint-disable-next-line no-throw-literal
      throw JSON.stringify(errors);
    }
    if (!userUpdated) {
      errors.err = 'Event can\'t created.';
      // eslint-disable-next-line no-throw-literal
      throw JSON.stringify(errors);
    }
    return {
      // eslint-disable-next-line no-underscore-dangle
      ...eventCreated._doc,
      creator: await userItem.bind(this, event.creator),
    };
  },
  createUser: async (args) => {
    let userExisted = null;
    try {
      userExisted = await User.findOne({ email: args.userInput.email });
    } catch (err) {
      throw err;
    }
    if (userExisted) {
      throw new Error('User exists already.');
    }

    let hashedPassword = null;
    try {
      hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    } catch (err) {
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
      throw err;
    }
    return {
      _id: userCreated.id,
      email: userCreated.email,
      password: 'null',
    };
  },
};
