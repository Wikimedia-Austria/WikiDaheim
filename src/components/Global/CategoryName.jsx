import React, { Component } from "react";
import PropTypes from "prop-types";

import { FormattedMessage } from "react-intl";

export default class CategoryName extends Component {
  static propTypes = {
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  render() {
    const { category } = this.props;

    const categoryName =
      typeof category === "string" ? category : category.get("name");

    let message = "";

    switch (categoryName) {
      case "denkmalliste":
        message = (
          <FormattedMessage
            id="category.denkmalliste"
            defaultMessage="Denkmäler"
          />
        );
        break;

      case "naturdenkmal":
        message = (
          <FormattedMessage id="category.naturdenkmal" defaultMessage="Natur" />
        );
        break;

      case "kellergasse":
        message = (
          <FormattedMessage
            id="category.kellergasse"
            defaultMessage="Kellergassen"
          />
        );
        break;

      case "publicart":
        message = (
          <FormattedMessage
            id="category.publicart"
            defaultMessage="Public Art"
          />
        );
        break;

      case "commons":
        message = (
          <FormattedMessage
            id="category.commons"
            defaultMessage="Gemeingüter"
          />
        );
        break;

      case "request":
        message = (
          <FormattedMessage
            id="category.request"
            defaultMessage="Bilderwunsch"
          />
        );
        break;

      default:
        message = (
          <span>
            {typeof category === "string" ? category : category.get("title")}
          </span>
        );
    }

    return <span className={`CategoryName--${categoryName}`}>{message}</span>;
  }
}
