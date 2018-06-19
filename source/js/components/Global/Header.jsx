import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';
import Menu from './Header/Menu';
import MenuToggle from './Header/MenuToggle';
import LanguageSwitch from './Header/LanguageSwitch';

import wikiDaheimLogo from '../../../assets/img/wikidaheim-logo.svg';

@connect(state => ({
  showMenu: state.menu.get('showMenu'),
}), null, null, { pure: false })
export default class Header extends Component {
  static propTypes = {
    showMenu: PropTypes.bool,
  };
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
            <button onClick={ () => window.location = '/' }>
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
            <button onClick={ () => window.location = '/' } />
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
