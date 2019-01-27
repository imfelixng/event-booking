import React from 'react';

export default React.createContext({
  token: null,
  userID: null,
  login: (token, userID, tokenExpriration) => {
    console.log(token);
  },
  logout: () => {

  }
});