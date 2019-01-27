import React, { Component } from 'react'
import './Auth.scss';

class Auth extends Component {

  state = {
    email: "",
    password: ""
  }

  onHandleChange = (e) => {
    let {name, value} = e.target;
    this.setState({
      [name]: value
    });
  }

  onSignIn = (e) => {
    e.preventDefault();
    let { email, password } = this.state;

    if(email.trim().length === 0 || password.trim().length === 0){
      alert("Please enter email and password!")
      return;
    }
    
    console.log(email, password);
  }

  render() {
    return (
      <React.Fragment>
        <form className = "auth-form" onSubmit = {this.onSignIn}>
          <div className = "form-control">
            <label htmlFor = "email">Email</label>
            <input 
              type = "email"
              name = "email"
              id = "email"
              value = {this.state.email}
              onChange = {this.onHandleChange}
            />
          </div>
          <div className = "form-control">
            <label htmlFor = "password">Password</label>
            <input 
              type = "password"
              name = "password"
              id = "password"
              value = {this.state.password}
              onChange = {this.onHandleChange}
            />
          </div>
          <div className  ="form-actions">
            <button
              type = "submit"
            >
              Sign In
            </button>
            <button
              type = "button"
            >
              Switch to Sign Up
            </button>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default Auth;