import React, { useContext } from "react";

import AuthContext from "./Store/auth-context";

import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

import PageLayoutWrapper from "./Components/Wrapper/PageLayoutWrapper";
import PrivacyAndPolicy from "./Pages/Static/PrivacyAndPolicy";
import TermsAndConditions from "./Pages/Static/TermsAndConditions";
import AboutUs from "./Pages/Static/AboutUs";
import Login from "./Pages/Authentication/Login";
import Registration from "./Pages/Authentication/Registration";
import Logout from "./Pages/Authentication/Logout";
import ProductOverviewPage from "./Pages/ProductPage/ProductOverviewPage";
import LandingPage from "./Pages/LandingPage/LandingPage";
import PageNotFound from "./Pages/Static/PageNotFound";

import LoadingModal from "./Components/UI/LoadingModal";

import {
  index,
  shopProduct,
  shop,
  account,
  termsAndConditions,
  privacyAndPolicy,
  aboutUs,
  logout,
  login,
  register,
  error,
} from "./Data/Routes";

const App = () => {
  const context = useContext(AuthContext);
  return (
    <PageLayoutWrapper>
      {!context.isDataFetched && <LoadingModal />}
      <BrowserRouter>
        <Switch>
          <Route exact path={index}>
            <LandingPage />
          </Route>
          <Route path={shopProduct}>
            <ProductOverviewPage />
          </Route>
          <Route exact path={shop}>
            <h1>Shop page</h1>
          </Route>
          <Route path={account}>
            <h1>My Account page</h1>
          </Route>
          <Route path={termsAndConditions}>
            <TermsAndConditions />
          </Route>
          <Route path={aboutUs}>
            <AboutUs />
          </Route>
          <Route path={privacyAndPolicy}>
            <PrivacyAndPolicy />
          </Route>
          <Route path={logout}>
            <Logout />
          </Route>
          <Route path={login}>
            <Login />
          </Route>
          <Route path={register}>
            <Registration />
          </Route>
          <Route path={error}>
            <PageNotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </PageLayoutWrapper>
  );
};

export default App;
