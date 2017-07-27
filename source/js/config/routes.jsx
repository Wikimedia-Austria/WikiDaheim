import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from 'views/Dashboard';
import About from 'views/About';
import Competition from 'views/Competition';
import Credits from 'views/Credits';
import NotFound from 'views/NotFound';

const publicPath = '/';

export const routeCodes = {
  DASHBOARD: publicPath,
  ABOUT: `${ publicPath }about`,
  COMPETITION: `${ publicPath }competition`,
  CREDITS: `${ publicPath }credits`,
};

export default () => (
  <Switch>
    <Route exact path={ publicPath } component={ Dashboard } />
    <Route path={ routeCodes.ABOUT } component={ About } />
    <Route path={ routeCodes.COMPETITION } component={ Competition } />
    <Route path={ routeCodes.CREDITS } component={ Credits } />
    <Route path='*' component={ NotFound } />
  </Switch>
);
