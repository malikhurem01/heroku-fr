import { useContext } from "react";
import AppContext from "../../Store/Context-API/app-context";
import sessionRemove from "../../Utils/sessionRemove";

const Logout = () => {
  const { handleIsNavHidden } = useContext(AppContext);
  handleIsNavHidden(true);
  sessionRemove();
  window.location.replace("/login?logout=true");
};

export default Logout;
