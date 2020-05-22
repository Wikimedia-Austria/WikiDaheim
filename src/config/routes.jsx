import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PUBLIC_ROOT } from 'config';
import pages from 'views/views.json';

import Dashboard from 'components/Dashboard';
import Page from 'components/Page';

const routeCodes = {
  DASHBOARD: PUBLIC_ROOT,
};

const loadedPages = pages.map((page) => {
  routeCodes[page.slug] = PUBLIC_ROOT.concat(page.slug);
  return page;
});

export default () => (
  <Switch>
    <Route exact path={ routeCodes.DASHBOARD } component={ Dashboard } />

    <Route path={ `${routeCodes.DASHBOARD}@:latlng/:municipaliy_id?/:municipality_name?/:selected_object?` } component={ Dashboard } />

    { loadedPages.map((page) => (
      <Route
        exact
        key={ page.slug }
        path={ routeCodes[page.slug] }
        render={ (routeProps) => (
          <Page { ...routeProps } page={ page } />
        ) }
      />
    )) }

    <Route path='*' component={ Dashboard } />
  </Switch>
);

export { routeCodes };
