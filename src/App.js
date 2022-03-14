import React from 'react';

import { AuthContextProvider } from './Store/auth-context';
import PageLayoutWrapper from './Components/PageLayoutWrapper';

import { Route, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import PrivacyAndPolicy from './Pages/PrivacyAndPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import AboutUs from './Pages/AboutUs';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import Logout from './Pages/Logout';

import ProductOverviewPage from './Pages/ProductPage/ProductOverviewPage';
import LandingPage from './Pages/LandingPage/LandingPage';

import routes from './Data/Routes';

function App({ user }) {
  return (
    <AuthContextProvider userData={user}>
      <PageLayoutWrapper>
        <BrowserRouter>
          <Switch>
            <Route exact path={routes.index}>
              <LandingPage />
            </Route>
            <Route path={routes.shopProduct}>
              <ProductOverviewPage />
            </Route>
            <Route exact path={routes.shop}>
              <h1>Shop page</h1>
            </Route>
            <Route path={routes.account}>
              <h1>My Account page</h1>
            </Route>
            <Route path={routes.termsAndConditions}>
              <TermsAndConditions />
            </Route>
            <Route path={routes.aboutUs}>
              <AboutUs />
            </Route>
            <Route path={routes.privacyAndPolicy}>
              <PrivacyAndPolicy />
            </Route>
            <Route path={routes.logout}>
              <Logout />
            </Route>
            <Route path={routes.login}>
              <Login />
            </Route>
            <Route path={routes.register}>
              <Registration />
            </Route>
          </Switch>
        </BrowserRouter>
      </PageLayoutWrapper>
    </AuthContextProvider>
  );
}

export default App;
