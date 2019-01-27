import React, { Component } from 'react'
import './Auth.scss';

class Auth extends Component {

  state = {
    email: "",
    password: "",
    isLogin: true,
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

    const reqBody = {
      query: this.state.isLogin ?
      `
        query {
          login(email: "${email}", password: "${password}") {
            userID
            token
            tokenExpriration
          }
        }
      `
      :
      `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}) {
            _id
            email
          }
        }
      `
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      }
    }
    )
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          email: "",
          password: ""
        });
      })
      .catch(err => {
        console.log(err);
      });
    return;
  }

  onSwitchAuth = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      }
    });
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
              {this.state.isLogin ? "Sign In" : "Sign Up"}
            </button>
            <button
              type = "button"
              onClick = {this.onSwitchAuth}
            >
              Switch to {this.state.isLogin ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default Auth;