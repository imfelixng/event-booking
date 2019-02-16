const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    let bookings = null;
    try {
      bookings = await Booking.find({user: req.userID});
    } catch (err) {
      throw err;
    }
    return bookings.map(booking => transformBooking(booking));
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    let fetchedEvent = null;
    try {
      fetchedEvent = await Event.findById(args.eventID);
    } catch (err) {
      throw err;
    }
    const booking = new Booking({
      user: req.userID,
      event: fetchedEvent,
    });

    let bookingCreated = null;
    try {
      bookingCreated = await booking.save();
    } catch (err) {
      throw err;
    }
    return transformBooking(bookingCreated);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    let bookingItem = null;
    try {
      bookingItem = await Booking.findById(args.bookingID).populate('event');
    } catch (err) {
      throw err;
    }
    if (!bookingItem) {
      throw new Error('Booking not found.');
    }
    try {
      await Booking.findOneAndDelete(args.bookingID);
    } catch (err) {
      throw err;
    }
    return transformEvent(bookingItem._doc.event);
  },
};
