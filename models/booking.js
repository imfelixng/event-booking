const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true }); // auto create createdAt and updatedAt

module.exports = mongoose.model('Booking', bookingSchema);
