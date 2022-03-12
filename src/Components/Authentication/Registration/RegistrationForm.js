import React from 'react';

import userService from '../../../Services/userService';

import classes from './Registration.module.css';

const RegistrationForm = () => {
  const handleSubmit = async ev => {
    ev.preventDefault();
    let registrationData = {
      first_name: ev.target.elements['firstName'].value,
      last_name: ev.target.elements['lastName'].value,
      email: ev.target.elements['email'].value,
      password: ev.target.elements['password'].value
    };

    return userService
      .register(registrationData)
      .then(() => window.location.replace('/login'))
      .catch(err => console.log(err));
  };
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h5>Register</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" placeholder="Doe" />
        </div>
        <div>
          <label htmlFor="email">Enter Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="user@domain.com"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
          />
          <div className={classes.register_btn}>
            <input type="submit" value="register" />
          </div>
          <div className={classes.alternative}>
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
