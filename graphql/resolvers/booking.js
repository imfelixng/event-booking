// eslint-disable-next-line import/no-unresolved
const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async () => {
    let bookings = null;
    try {
      bookings = await Booking.find();
    } catch (err) {
      throw err;
    }
    return bookings.map(booking => transformBooking(booking));
  },
  bookEvent: async (args) => {
    let fetchedEvent = null;
    try {
      fetchedEvent = await Event.findById(args.eventID);
    } catch (err) {
      throw err;
    }
    const booking = new Booking({
      user: '5c3f7b7bbf8d1d815c0b6cf2',
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
  cancelBooking: async (args) => {
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
      // eslint-disable-next-line no-underscore-dangle
      await Booking.findOneAndDelete(args.bookingID);
    } catch (err) {
      throw err;
    }
    // eslint-disable-next-line no-underscore-dangle
    return transformEvent(bookingItem._doc.event);
  },
};
