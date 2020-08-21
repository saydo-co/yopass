import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Container, Navbar, NavbarBrand, NavbarText } from 'reactstrap';

import './App.scss';
import Create from './Create';
import DisplaySecret from './DisplaySecret';
import Download from './Download';
import Features from './Features';
import Upload from './Upload';
import { useTranslation } from 'react-i18next';

const App = () => {
  return (
    <Router>
      <Navbar color="dark" dark={true} expand="md">
        <NavbarBrand href="/">
          <img width="200" height="40" alt="" src="saydo.svg" />
        </NavbarBrand>
        <NavbarText className="mr-2">
          Send us a secret. No man in the middle.
        </NavbarText>
      </Navbar>
      <Container className="margin">
        <Routes />
      </Container>
      <Features />
      <Attribution />
    </Router>
  );
};

const Routes = () => {
  return (
    <div>
      <Route path="/" exact={true} component={Create} />
      <Route path="/upload" exact={true} component={Upload} />
      <Route exact={true} path="/s/:key/:password" component={DisplaySecret} />
      <Route exact={true} path="/s/:key" component={DisplaySecret} />
      <Route exact={true} path="/f/:key/:password" component={Download} />
      <Route exact={true} path="/f/:key" component={Download} />
    </div>
  );
};

const Attribution = () => {
  const { t } = useTranslation();
  return (
    <Container className="text-center">
      <div className="text-muted small footer">
        {t('With ♥ and thanks to')}{' '}
        <a href="https://github.com/jhaals/yopass">{t('Johan Haals')}</a>
      </div>
    </Container>
  );
};

export default App;
