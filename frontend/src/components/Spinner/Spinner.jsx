import React from 'react';
import './Spinner.scss';

const Spinner = (props) => {
  return (
    <React.Fragment>
      <div className ="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </React.Fragment>
  )
}

export default Spinner;