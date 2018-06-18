import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class ExternalLinkOverlay extends Component {
  static propTypes = {
    title: PropTypes.object,
    text: PropTypes.object,
    link: PropTypes.string,
    closeAction: PropTypes.func,
  };
  render() {
    const { title, text, link, closeAction } = this.props;

    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className='ExternalLink-Overlay'
        onClick={ closeAction }
      >
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className='ExternalLink-Overlay-Inner'
          onClick={ (e) => e.stopPropagation() }
        >
          <button
            className='ExternalLink-Close'
            onClick={ closeAction }
          >
            <FormattedMessage
              id='cancel'
              description='Text for Cancel-Buttons'
              defaultMessage='Abbrechen'
            />
          </button>
          <h1>{ title }</h1>
          <p>{ text }</p>
          <a
            href={ link }
            target='_blank'
            rel='noopener noreferrer'
            onClick={ closeAction }
          >
            <FormattedMessage
              id='cityinfo.openLink'
              description='Text for External Link-Buttons (from City Details View)'
              defaultMessage='Seite öffnen'
            />
          </a>
        </div>
      </div>
    );
  }
}

export default ExternalLinkOverlay;
