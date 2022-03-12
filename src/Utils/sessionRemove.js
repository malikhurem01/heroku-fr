const sessionRemove = () => {
  sessionStorage.removeItem('user_jwt');
  sessionStorage.clear();
};

export default sessionRemove;
