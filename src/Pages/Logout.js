import sessionRemove from '../Utils/sessionRemove';

const Logout = () => {
  sessionRemove();
  window.location.replace('/login');
};

export default Logout;
