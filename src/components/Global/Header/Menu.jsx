import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { routeCodes } from "/src/config/routes";
import { FALLBACK_LANGUAGE } from "/src/config";

import pages from "/src/views/views";

console.log(pages);

class Header extends Component {
  static propTypes = {
    currentLanguage: PropTypes.string,
  };

  render() {
    const { currentLanguage } = this.props;
    return (
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? "Menu-link--active" : "Menu-link"
          }
          to={routeCodes.DASHBOARD}
        >
          <span>WikiDaheim</span>
        </NavLink>

        {pages
          .filter((page) => page.in_menu)
          .map((page) => (
            <NavLink
              key={page.slug}
              className={({ isActive }) =>
                isActive ? "Menu-link--active" : "Menu-link"
              }
              to={routeCodes[page.slug]}
            >
              <span>
                {page.menu_title[currentLanguage]
                  ? page.menu_title[currentLanguage]
                  : page.menu_title[FALLBACK_LANGUAGE]}
              </span>
            </NavLink>
          ))}
        <footer>
          <FormattedMessage
            id="menu.email"
            description="Feedback email address"
            defaultMessage="Email"
          >
            {(title) => (
              <a
                className="Menu-link--email"
                href="mailto:wikidaheim@wikimedia.at"
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            )}
          </FormattedMessage>

          <FormattedMessage
            id="menu.imprint"
            description="Link title to Wikimedia Imprint and Privacy Page"
            defaultMessage="Impressum & Datenschutz"
          >
            {(title) => (
              <a
                className="Menu-link--imprint"
                href="https://wikimedia.at/impressum-datenschutz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            )}
          </FormattedMessage>
        </footer>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    currentLanguage: state.locale.get("language"),
  }),
  null,
  null
)(Header);
