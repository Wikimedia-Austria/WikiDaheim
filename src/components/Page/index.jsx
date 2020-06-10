import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FALLBACK_LANGUAGE } from 'config';
import classNames from 'classnames';
import Views from 'views';

class Page extends Component {
  static propTypes = {
    page: PropTypes.object,
    currentLanguage: PropTypes.string,
  };

  render() {
    const { currentLanguage } = this.props;
    const { slug } = this.props.page;

    const templateName = `${ slug }_${ currentLanguage }`;

    let content = `
      <h2>Error loading page.</h2>
      <p>Neither the language-specific template nor the the fallback file was found.</p>
      <code>Searching for: "views/${ templateName }.html"</code>
    `;

    if (Views.hasOwnProperty(`${ slug }_${ currentLanguage }`)) { // eslint-disable-line no-prototype-builtins
      content = Views[`${ slug }_${ currentLanguage }`];
    } else if (Views.hasOwnProperty(`${ slug }_${ FALLBACK_LANGUAGE }`)) { // eslint-disable-line no-prototype-builtins
      content = Views[`${ slug }_${ FALLBACK_LANGUAGE }`];
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

export default connect(state => ({
  currentLanguage: state.locale.get('language'),
}))(Page);
