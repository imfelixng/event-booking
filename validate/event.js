const validator = require('validator');
const moment = require('moment');

const isEmpty = require('./is-empty');

module.exports = (data) => {
  const errors = {};
  // eslint-disable-next-line no-param-reassign
  data.title = !isEmpty(data.title) ? data.title : '';
  // eslint-disable-next-line no-param-reassign
  data.description = !isEmpty(data.description) ? data.description : '';
  // eslint-disable-next-line no-param-reassign
  data.price = !isEmpty(data.price) ? data.price : '';
  // eslint-disable-next-line no-param-reassign
  data.price = !(typeof data.price === 'string') ? data.price : '';
  // eslint-disable-next-line no-param-reassign
  data.date = !isEmpty(data.date) ? data.date : '';
  if (validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }
  if (validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }
  if (!validator.isFloat(`${data.price}`)) {
    errors.price = 'Price field is required';
  }
  if (validator.isEmpty(`${data.price}`)) {
    errors.price = 'Price field is required';
  }
  if (!moment(data.date).isValid()) {
    errors.date = 'Date field is invalid format';
  }
  if (validator.isEmpty(data.date)) {
    errors.date = 'Date field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
