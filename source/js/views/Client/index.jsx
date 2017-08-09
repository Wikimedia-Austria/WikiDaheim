import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from 'views/App';
import ScrollToTop from 'components/Global/ScrollToTop';

export default () => (
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>
);
