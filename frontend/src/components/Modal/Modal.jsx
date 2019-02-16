import React from 'react'
import './Modal.scss';

const modal = (props) => {
  return (
    <React.Fragment>
      <div className = "modal">
        <header className = "modal__header">{props.title}</header>
        <section className = "modal__content">
          <h1>{props.children}</h1>
        </section>
        <section className = "modal__actions">
          {props.canCancel && <button className = "btn btn--red" onClick = {props.onCloseModal}>Cancel</button>}
          {props.canConfirm && <button className = "btn btn--green" onClick = {props.onConfirm}> {props.confirmText}</button>}
        </section>
      </div>
    </React.Fragment>
  )
};

export default modal;
