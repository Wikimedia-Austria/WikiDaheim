import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { routeCodes } from 'config/routes';
import MenuToggle from './Header/MenuToggle';

import wikiDaheimLogo from '../../../assets/img/wikidaheim-logo.svg';
import wikiDaheimClaim from '../../../assets/img/wikidaheim-claim.svg';

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
            <img
              src={ wikiDaheimLogo }
              alt='WikiDaheim Logo'
            />
          </div>
          <div className='Header-claim'>
            <img
              src={ wikiDaheimClaim }
              alt='WikiDaheim'
            />
          </div>
          <div className='Header-menuToggle'>
            <MenuToggle />
          </div>
        </div>

        <div className={ headerMenuClass }>
          <NavLink
            activeClassName='Menu-link--active'
            className='Menu-link'
            exact
            to={ routeCodes.DASHBOARD }
          >
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            activeClassName='Menu-link--active'
            className='Menu-link'
            to={ routeCodes.ABOUT }
          >
            <span>Über</span>
          </NavLink>
        </div>
      </div>
    );
  }
}
