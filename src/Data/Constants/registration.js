const ERROR_PASSWORD =
  "Password must contain at least one numeric digit, one uppercase and one lowercase letter.";
const ERROR_USER = "User with that email already exists";
const SERVER_ERROR =
  "Error happened on server side. Sorry for the inconvenience";

const errorMessages = {
  ERROR_PASSWORD,
  ERROR_USER,
  SERVER_ERROR,
};

module.exports = errorMessages;
