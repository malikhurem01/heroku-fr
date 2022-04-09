import React, { useContext } from "react";

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

import AppContext from "./Store/Context-API/app-context";

import {
  index,
  shopProduct,
  shopCategory,
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
import Shop from "./Pages/ShopPage/Shop";

const App = () => {
  const { isDataLoading } = useContext(AppContext);
  return (
    <BrowserRouter>
      <PageLayoutWrapper>
        {isDataLoading && <LoadingModal />}
        <Switch>
          <Route exact path={index}>
            <LandingPage />
          </Route>
          <Route path={shopProduct}>
            <ProductOverviewPage />
          </Route>
          <Route exact path={shopCategory}>
            <Shop />
          </Route>
          <Route exact path={shop}>
            <Shop />
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
      </PageLayoutWrapper>
    </BrowserRouter>
  );
};

export default App;
