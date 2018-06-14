import React, { Component } from 'react';
import Routes from 'config/routes';
import PropTypes from 'prop-types';

import Header from 'components/Global/Header';

import svgSprite from 'svg-sprite-loader/runtime/sprite.build';

const sprite = svgSprite.stringify();

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  }

  componentDidMount() {
    window.addEventListener('touchstart', function onFirstTouch() {
      window.USER_IS_TOUCHING = true;
      window.removeEventListener('touchstart', onFirstTouch, false);
    }, false);
  }

  render() {
    return (
      <div className='App'>
        <Header />

        <div className='Page'>
          <Routes />
        </div>

        {/* SVG sprite injected inline, to make it work in IE10 and IE11  */}
        <div
          style={ { display: 'none' } }
          dangerouslySetInnerHTML={ { __html: sprite } } // eslint-disable-line react/no-danger
        />
      </div>
    );
  }
}
