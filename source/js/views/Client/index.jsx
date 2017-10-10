import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from 'views/App';
import ScrollToTop from 'components/Global/ScrollToTop';

// use HashRouter for gh-pages via Travis CI
const Router = !!process.env.CONTINUOUS_INTEGRATION ? HashRouter : BrowserRouter; // eslint-disable-line

export default () => (
  <Router>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>
);
