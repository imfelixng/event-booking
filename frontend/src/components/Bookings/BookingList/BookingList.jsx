import React from 'react'
import './BookingList.scss';

import BookingItem from './BookingItem/BookingItem';

const BookingList = props => {
  const bookingList = props.bookings.map(booking => {
    return (
      <BookingItem 
        booking = {booking}
        key = {booking._id}
        userID = {props.authUserID}
        onCancel = {props.onCancel}
      />
    );
  }) || null;
  return (
    <React.Fragment>
      <ul className = "event__list">
        {bookingList}
      </ul>
    </React.Fragment>
  );
};
export default BookingList;
