import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';
import { clearState } from 'lib/localStorage';
import Menu from './Menu';
import MenuToggle from './MenuToggle';
import LanguageSwitch from './LanguageSwitch';

import wikiDaheimLogo from 'assets/img/wikidaheim-logo.svg';

class Header extends Component {
  static propTypes = {
    showMenu: PropTypes.bool,
  };

  clearAndReload() {
    clearState();
    window.location = '/';
  }

  render() {
    const {
      showMenu,
    } = this.props;

    const headerMenuClass = classNames({
      'Header-menu': true,
      'Header-menu--active': showMenu,
    });

    return (
      <div className='Header'>
        <div className='Header-bar'>
          <div className='Header-logo'>
            <button onClick={ this.clearAndReload }>
              <FormattedMessage
                id='header.logoAlt'
                description='Alt Text of the header Logo'
                defaultMessage='WikiDaheim-Logo'
              >
                {(alt) => (
                  <img
                    src={ wikiDaheimLogo }
                    alt={ alt }
                  />
                )}
              </FormattedMessage>
            </button>
          </div>
          <div className='Header-claim'>
            <button onClick={ this.clearAndReload } />
          </div>
          <div className='Header-languageSwitch'>
            <LanguageSwitch />
          </div>
          <div className='Header-menuToggle' />
        </div>

        <div className={ headerMenuClass }>
          <Menu />
        </div>
        <MenuToggle />
      </div>
    );
  }
}

export default connect(state => ({
  showMenu: state.menu.get('showMenu'),
}), null, null, { pure: false })(Header);
