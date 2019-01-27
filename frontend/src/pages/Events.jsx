import React, { Component } from 'react'
import './Events.scss';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import moment from 'moment';
import AuthContext from '../contexts/auth-context';

class Events extends Component {
  state = {
    isShowModal: false,
    title: "",
    description: "",
    price: 0,
    date: moment().format("YYYY-MM-DDTHH:MM"),
    events: []
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvents();
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

  onHandleChange = (e) => {
    let {name, value} = e.target;
    this.setState({
      [name]: value
    });
  }

  onAddEvent = () => {
    let { title, description, price, date } = this.state;

    if(title.trim().length === 0 || price < 0 || date.trim().length === 0) {
      alert("Please enter all fields requied!");
      return;
    }

    const reqBody = {
      query:
      `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            creator {
              _id
              email
            }
          }
        }
      `
    }

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + this.context.token,
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(data => {
        this.setState(prevState => {
          return {
            events: [data.data.createEvent,...prevState.events]
          }
        })
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      isShowModal: false,
      title: "",
      description: "",
      price: 0,
      date: moment().format("YYYY-MM-DDTHH:MM")
    });
  }

  fetchEvents = () => {
    const reqBody = {
      query:
      `
        query {
          events{
            _id
            title
            description
            date
            creator {
              _id
              email
            }
          }
        }
      `
    }

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          events: data.data.events.reverse()
        })
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {

    const eventList = this.state.events.map(event => {
      return (
        <li className = "events__list-item" key = {event._id}>
          {event.title}
        </li>
      );
    }) || null;

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
            <form>
              <div className = "form-control">
                <label htmlFor = "title">Title</label>
                <input 
                  type = "title"
                  name = "title"
                  id = "title"
                  value = {this.state.title}
                  onChange = {this.onHandleChange}
                />
              </div>
              <div className = "form-control">
                <label htmlFor = "price">Price</label>
                <input 
                  type = "number"
                  name = "price"
                  id = "price"
                  value = {this.state.price}
                  onChange = {this.onHandleChange}
                />
              </div>
              <div className = "form-control">
                <label htmlFor = "date">Date</label>
                <input 
                  type = "datetime-local"
                  name = "date"
                  id = "date"
                  value = {this.state.date}
                  onChange = {this.onHandleChange}
                />
              </div>
              <div className = "form-control">
                <label htmlFor = "description">Description</label>
                <textarea 
                  name = "description"
                  value = {this.state.description}
                  onChange = {this.onHandleChange}
                  rows = "4"
                ></textarea>
              </div>
            </form>
          </Modal>
        }
        {this.state.isShowModal && <Backdrop />}
        {
          this.context.token && 
          <React.Fragment>
            <div className = "events-control">
              <p>Share your own Events</p>
              <button className = "btn btn--blue" onClick = {this.onShowModal}>Create Event</button>
            </div>
          </React.Fragment>
        }
        <ul className = "events__list">
          {eventList}
        </ul>
      </React.Fragment>
    )
  }
}
export default Events;