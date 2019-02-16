import React from 'react'
import './BookingItem.scss';

const BookingItem = props => (
  <React.Fragment>
    <li className = "event__list-item">
      <div>
        {props.booking.event.title} - {' '}
        {new Date(props.booking.createdAt).toLocaleDateString()}
      </div>
      <div>
        <button className = "btn btn--red" onClick = {() => props.onCancel(props.booking._id)}>Cancel</button>
      </div>
    </li>
  </React.Fragment>
);

export default BookingItem;