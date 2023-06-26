import React from "react";
import { Route, Routes } from "react-router-dom";
import { createBrowserHistory } from "history";

import { PUBLIC_ROOT } from "config";
import pages from "views/views.json";

import Dashboard from "components/Dashboard";
import Page from "components/Page";

const routeCodes = {
  DASHBOARD: PUBLIC_ROOT,
};

const loadedPages = pages.map((page) => {
  routeCodes[page.slug] = PUBLIC_ROOT.concat(page.slug);
  return page;
});

const history = createBrowserHistory({ window });

const RoutesMapper = () => (
  <Routes>
    <Route exact path={routeCodes.DASHBOARD} element={<Dashboard />} />

    {loadedPages.map((page) => (
      <Route
        exact
        key={page.slug}
        path={routeCodes[page.slug]}
        element={<Page page={page} />}
      />
    ))}

    <Route path="*" element={<Dashboard />} />
  </Routes>
);

export { routeCodes, history };
export default RoutesMapper;
