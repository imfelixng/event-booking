import React, { Component } from 'react'
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../contexts/auth-context';

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: []
  }

  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  fetchBookings = () => {
    this.setState({isLoading: true});
    const reqBody = {
      query:
      `
        query {
          bookings{
            _id
            event {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
            user {
              _id
              email
            }
            createdAt
            updatedAt
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
        if (this.isActive) {
          this.setState({
            bookings: data.data.bookings.reverse(),
          });
        }

      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => this.setState({isLoading: false}));
  }

  render() {
    const bookinglist = this.state.bookings.map(booking => {
      return <li key = {booking._id}>{booking.event.title} - {new Date(booking.event.date).toLocaleDateString()}</li>
    });
    return (
      <React.Fragment>
        {
          this.state.isLoading 
          ? 
          <Spinner />
          :
          <ul>
            {bookinglist}
          </ul>

        }
      </React.Fragment>
    )
  }
}
export default Bookings;