import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { routeCodes } from 'config/routes';

export default class Header extends Component {
  render() {
    return (
      <div>
        <NavLink
          activeClassName='Menu-link--active'
          className='Menu-link'
          exact
          to={ routeCodes.DASHBOARD }
        >
          <span>WikiDaheim</span>
        </NavLink>
        <NavLink
          activeClassName='Menu-link--active'
          className='Menu-link'
          exact
          to={ routeCodes.ABOUT }
        >
          <span>Über</span>
        </NavLink>
        <NavLink
          activeClassName='Menu-link--active'
          className='Menu-link'
          to={ routeCodes.TOPICS  }
        >
          <span>Themen</span>
        </NavLink>
        <NavLink
          activeClassName='Menu-link--active'
          className='Menu-link'
          to={ routeCodes.COMPETITION }
        >
          <span>Wettbewerb</span>
        </NavLink>
        <NavLink
          activeClassName='Menu-link--active'
          className='Menu-link'
          to={ routeCodes.CREDITS }
        >
          <span>Credits</span>
        </NavLink>

        <footer>
          <a
            className='Menu-link--imprint'
            href='https://www.wikimedia.at/ueber-uns/kontakt/impressum/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Impressum & Datenschutz
          </a>
          <a
            className='Menu-link--facebook'
            href='https://facebook.com/wikiDaheim'
            target='_blank'
            rel='noopener noreferrer'
          >
            Facebook
          </a>
        </footer>
      </div>
    );
  }
}
