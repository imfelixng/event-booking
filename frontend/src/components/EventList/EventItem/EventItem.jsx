import React from 'react'
import './EventItem.scss';

const EventItem = props => (
  <React.Fragment>
    <li className = "event__list-item">
      <div>
        <h1>{props.event.title}</h1>
        <h2>${props.event.price} - {new Date(props.event.date).toLocaleDateString()}</h2>
      </div>
      <div>
        {
          props.userID !== props.event.creator._id 
          ?
            <button className = "btn" onClick = {()=> props.onDetail(props.event._id)}>View Details</button>
          :  <p>Your the owner of this event.</p>
        }
      </div>
    </li>
  </React.Fragment>
);

export default EventItem;