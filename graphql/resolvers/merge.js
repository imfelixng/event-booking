
const User = require('../../models/user');
const Event = require('../../models/event');

const { dateToString } = require('../../helpers/date');

const transformEvent = async event => ({
  // eslint-disable-next-line no-underscore-dangle
  ...event._doc,
  // eslint-disable-next-line no-use-before-define
  creator: await userItem.bind(this, event.creator),
  date: dateToString(event.date),
});
const transformBooking = async booking => ({
  // eslint-disable-next-line no-underscore-dangle
  ...booking._doc,
  // eslint-disable-next-line no-use-before-define
  event: singleEvent.bind(this, booking.event),
  // eslint-disable-next-line no-use-before-define
  user: userItem.bind(this, booking.user),
  // eslint-disable-next-line no-underscore-dangle
  createdAt: dateToString(booking._doc.createdAt),
  // eslint-disable-next-line no-underscore-dangle
  updatedAt: dateToString(booking._doc.updatedAt),
});

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
    // eslint-disable-next-line no-use-before-define
    createdEvents: await eventList.bind(this, user.createdEvents),
  };
};

const eventList = async (eventIDs) => {
  let events = [];
  try {
    events = await Event.find({ _id: { $in: eventIDs } });
  } catch (err) {
    throw err;
  }
  return events.map(event => transformEvent(event));
};

const singleEvent = async (eventID) => {
  let eventItem = null;
  try {
    eventItem = await Event.findById(eventID);
  } catch (err) {
    throw err;
  }
  return transformEvent(eventItem);
};

exports.userItem = userItem;
exports.eventList = eventList;
exports.singleEvent = singleEvent;

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
