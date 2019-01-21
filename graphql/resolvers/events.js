// eslint-disable-next-line import/no-unresolved
const Event = require('../../models/event');
const User = require('../../models/user');

// eslint-disable-next-line import/no-unresolved
const ValidateEventInput = require('../../validate/event');

const { dateToString } = require('../../helpers/date');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    let events = [];
    try {
      events = await Event.find().populate('creator');
    } catch (err) {
      throw err;
    }
    return events.map(event => transformEvent(event));
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const { errors, isValid } = ValidateEventInput(args.eventInput);
    if (!isValid) {
      // eslint-disable-next-line no-throw-literal
      throw JSON.stringify(errors);
    }
    const event = new Event({
      ...args.eventInput,
      date: dateToString(args.eventInput.date),
      creator: req.userID,
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
      user = await User.findById(req.userID);
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
    return transformEvent(eventCreated);
  },
};
