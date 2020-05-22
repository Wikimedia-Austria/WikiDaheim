import React, { Component } from 'react';
import { connect } from 'react-redux';
import Routes from 'config/routes';
import PropTypes from 'prop-types';

import Header from './Global/Header';
import CookieBanner from 'react-cookie-banner';
import { FormattedMessage } from 'react-intl';
import findGetParameter from 'lib/findGetParameter';
import { setLanguage } from 'redux/actions/locale';

//import svgSprite from 'svg-sprite-loader/runtime/sprite.build';
import languages from 'translations/languages.json';

//const sprite = svgSprite.stringify();

class Root extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    // from react-redux connect
    dispatch: PropTypes.func,
  }

  componentDidMount() {
    const { dispatch } = this.props;

    window.addEventListener('touchstart', function onFirstTouch() {
      window.USER_IS_TOUCHING = true;
      window.removeEventListener('touchstart', onFirstTouch, false);
    }, false);

    /* check if we have to set the language due to a url parameter */
    const wishedLanguage = findGetParameter('hlang');
    if (wishedLanguage && languages.filter(l => l.locale === wishedLanguage).length > 0) {
      dispatch(setLanguage(wishedLanguage));
    }
  }

  render() {
    return (
      <div className='App'>
        <Header />

        <div className='Page'>
          <Routes />
        </div>

        {/* SVG sprite injected inline, to make it work in IE10 and IE11
        <div
          style={ { display: 'none' } }
          dangerouslySetInnerHTML={ { __html: sprite } } // eslint-disable-line react/no-danger
        />
          */}

        <FormattedMessage
          id='gdpr.cookietext'
          description='Text for the Cookie Information'
          defaultMessage='WikiDaheim verwendet Cookies. Mit dem verwenden der App stimmst du diesen zu.'
        >
          {(text) => (
            <CookieBanner
              message={ text }
              onAccept={ () => {} }
              cookie='user-has-accepted-cookies'
              buttonMessage='OK'
              link={ <a
                href='https://www.wikimedia.at/ueber-uns/kontakt/impressum/'
                target='_blank'
                rel='noopener noreferrer'
              >
                Cookie Policy
              </a> }
            />
          )}
        </FormattedMessage>
      </div>
    );
  }
}

export default connect(null, null, null, { pure: false })(Root);
