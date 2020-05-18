import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ScrollToTop from './Global/ScrollToTop';

export default () => (
  <Router>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>
);
