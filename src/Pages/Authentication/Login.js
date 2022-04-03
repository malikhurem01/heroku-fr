import React from "react";
import useQuery from "../../Hooks/useQuery";

import LoginForm from "../../Components/Authentication/Login/LoginForm";
import Modal from "../../Components/UI/Modal";

const Login = () => {
  const query = useQuery();
  return (
    <React.Fragment>
      {query.get("success") && (
        <Modal title={"Success!"} message={"Please log in to continue"} />
      )}
      {query.get("logout") && (
        <Modal
          title={"Goodbye!"}
          message={"You have successfully logged out"}
        />
      )}
      <LoginForm />
    </React.Fragment>
  );
};

export default Login;
