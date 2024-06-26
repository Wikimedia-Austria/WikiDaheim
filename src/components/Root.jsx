import React, { Component } from "react";
import { connect } from "react-redux";
import Routes from "/src/config/routes";
import PropTypes from "prop-types";

import Header from "./Global/Header";
import findGetParameter from "/src/utils/findGetParameter";
import { setLanguage } from "/src/redux/actions/locale";

import languages from "/src/translations/languages.json";

class Root extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    window.addEventListener(
      "touchstart",
      function onFirstTouch() {
        window.USER_IS_TOUCHING = true;
        window.removeEventListener("touchstart", onFirstTouch, false);
      },
      false
    );

    /* check if we have to set the language due to a url parameter */
    const wishedLanguage = findGetParameter("hlang");
    if (
      wishedLanguage &&
      languages.filter((l) => l.locale === wishedLanguage).length > 0
    ) {
      dispatch(setLanguage(wishedLanguage));
    }
  }

  render() {
    return (
      <div className="App">
        <Header />

        <div className="Page">
          <Routes />
        </div>
      </div>
    );
  }
}

export default connect(null, null, null)(Root);
