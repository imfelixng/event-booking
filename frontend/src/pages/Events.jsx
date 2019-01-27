import React, { Component } from 'react'
import './Events.scss';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class Events extends Component {
  state = {
    isShowModal: false
  }

  onShowModal = () => {
    this.setState({
      isShowModal: true
    })
  }

  onCloseModal = () => {
    this.setState({
      isShowModal: false
    });
  }

  onAddEvent = () => {
    alert("Confirm!");
    this.setState({
      isShowModal: false
    });
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.isShowModal && 
          <Modal
            title = "Add Event"
            canCancel
            canConfirm
            onCloseModal = {this.onCloseModal}
            onAddEvent = {this.onAddEvent}
          >
            <p>Modal content</p>
          </Modal>
        }
        {this.state.isShowModal && <Backdrop />}
        <div className = "events-control">
        <p>Share your own Events</p>
          <button className = "btn btn--blue" onClick = {this.onShowModal}>Create Event</button>
        </div>
      </React.Fragment>
    )
  }
}
export default Events;