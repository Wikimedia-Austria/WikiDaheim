import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { routeCodes } from 'config/routes';
import { FALLBACK_LANGUAGE } from 'config/config';

import pages from 'views/views.json';

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

        { pages.map((page) => (
          <NavLink
            key={ page.slug }
            activeClassName='Menu-link--active'
            className='Menu-link'
            exact
            to={ routeCodes[page.slug] }
          >
            <span>
              { page.menu_title[FALLBACK_LANGUAGE] }
            </span>
          </NavLink>
        )) }

        <footer>
          <FormattedMessage
            id='menu.facebook'
            desctiption='Link title to WikiDaheim Facebook-Page'
            defaultMessage='Facebook'
          >
            {(title) => (
              <a
                className='Menu-link--facebook'
                href='https://facebook.com/wikiDaheim'
                target='_blank'
                rel='noopener noreferrer'
              >
                { title }
              </a>
            )}
          </FormattedMessage>

          <FormattedMessage
            id='menu.imprint'
            desctiption='Link title to Wikimedia Imprint and Privacy Page'
            defaultMessage='Impressum & Datenschutz'
          >
            {(title) => (
              <a
                className='Menu-link--imprint'
                href='https://www.wikimedia.at/ueber-uns/kontakt/impressum/'
                target='_blank'
                rel='noopener noreferrer'
              >
                { title }
              </a>
            )}
          </FormattedMessage>
        </footer>
      </div>
    );
  }
}
