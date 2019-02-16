import React from 'react'
import './EventList.scss';

import EventItem from './EventItem/EventItem';

const EventList = props => {
  const eventList = props.events.map(event => {
    return (
      <EventItem 
        event = {event}
        key = {event._id}
        userID = {props.authUserID}
        onDetail = {props.onViewDetail}
      />
    );
  }) || null;
  return (
    <React.Fragment>
      <ul className = "event__list">
        {eventList}
      </ul>
    </React.Fragment>
  );
};
export default EventList;
