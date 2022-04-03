const validatePassword = (password) => {
  var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if (password.match(regex)) {
    return true;
  }
  return false;
};

export default validatePassword;
