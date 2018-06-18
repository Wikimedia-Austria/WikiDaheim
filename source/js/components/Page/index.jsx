import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FALLBACK_LANGUAGE } from 'config/config';
import classNames from 'classnames';
import * as Views from '../../views';

export default class About extends Component {
  static propTypes = {
    page: PropTypes.object,
  };

  render() {
    const { slug } = this.props.page;

    const templateName = `${ slug }_${ FALLBACK_LANGUAGE }`;
    let content = `
      <h2>Error loading page.</h2>
      <p>Neither the language-specific template nor the the fallback file was found.</p>
      <code>Searching for: "views/${ templateName }.html"</code>
    `;

    if (Views.hasOwnProperty(templateName)) { // eslint-disable-line no-prototype-builtins
      content = Views[templateName];
    }

    const ItemClass = classNames(
      'TextPage',
      `TextPage--${ slug }`
    );

    return (
      <div
        className={ ItemClass }
        dangerouslySetInnerHTML={   // eslint-disable-line react/no-danger
          { __html: content }
        }
      />
    );
  }
}
