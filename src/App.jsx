/* REACT */
import React from "react";

/* REDUX */
import { Provider } from "react-redux";
import configureStore from "/src/redux/store";

/* ROUTER */
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { history } from "/src/config/routes";

/* APP COMPONENTS */
import ReduxIntlProvider from "/src/components/Global/ReduxIntlProvider";
import Root from "/src/components/Root";
import ScrollToTop from "/src/components/Global/ScrollToTop";

// Load SCSS
import "./scss/app.scss";

// Init Redux-Store
const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <ReduxIntlProvider>
        <HistoryRouter history={history}>
          <ScrollToTop>
            <Root />
          </ScrollToTop>
        </HistoryRouter>
      </ReduxIntlProvider>
    </Provider>
  );
}

export default App;
