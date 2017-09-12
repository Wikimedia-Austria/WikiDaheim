import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { routeCodes } from 'config/routes';
import Menu from './Header/Menu';
import MenuToggle from './Header/MenuToggle';

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
              <img
                src={ wikiDaheimLogo }
                alt='WikiDaheim Logo'
              />
            </button>
          </div>
          <div className='Header-claim'>
            <button onClick={ () => window.location = '/' } />
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
