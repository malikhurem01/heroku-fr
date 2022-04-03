import sessionRemove from "../../Utils/sessionRemove";

const Logout = () => {
  sessionRemove();
  window.location.replace("/login?logout=true");
};

export default Logout;
