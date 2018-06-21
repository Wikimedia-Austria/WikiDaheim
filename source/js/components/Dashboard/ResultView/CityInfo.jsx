import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleCityInfo } from 'actions/app';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import CityInfoSection from './CityInfoSection';
import ExternalLinkOverlay from './ExternalLinkOverlay';

@connect(state => ({
  articles: state.app.get('articles'),
  placeMapData: state.app.get('placeMapData'),
  showCityInfo: state.app.get('showCityInfo'),
  commonscat: state.app.get('commonscat'),
}))
class CityInfo extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(List),
    placeMapData: PropTypes.instanceOf(Map),
    showCityInfo: PropTypes.bool,
    commonscat: PropTypes.string,

    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      shownLink: null,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { dispatch } = this.props;

    dispatch(toggleCityInfo());
  }

  render() {
    const { articles, placeMapData, showCityInfo, commonscat } = this.props;

    const cityName = placeMapData.get('text');
    const currentArticle = articles.get(0);

    if (!currentArticle) return null;

    let externalLinkOverlay = null;

    if (this.state.shownLink) {
      switch (this.state.shownLink) {
        case 'regio': {
          const title = (<FormattedMessage
            id='cityinfo.regiowikiTitle'
            description='Title for RegioWiki'
            defaultMessage='RegioWiki'
          />);

          const text = (<FormattedMessage
            id='cityinfo.regiowikiText'
            description='Text for RegioWiki'
            defaultMessage='Im RegioWiki kannst du all jene Themen deiner
            Umgebung beschreiben, die nicht von großem überregionalem Interesse
            sind, aber für deine Gemeinde eine Bedeutung haben. Dazu zählen etwa
            die heimische Blasmusikkapelle, die Beschreibung des jährlichen
            Kirtags oder die Chronologie der Umzüge im Ort. Du kannst dich auf
            Regiowiki einfach registrieren und danach sofort loslegen!'
          />);

          externalLinkOverlay = (<ExternalLinkOverlay
            title={ title }
            text={ text }
            link={ `http://regiowiki.at/wiki/${ currentArticle.get('source') }` }
            closeAction={ () => this.setState({ 'shownLink': null }) }
          />);
          break;
        }
        default:
      }
    }

    const ItemClass = classNames({
      'CityInfo': true,
      'CityInfo--opened': showCityInfo,
    });

    return (
      <section className={ ItemClass }>
        <header className='CityInfo-Header'>
          <h1>{ cityName }</h1>
          <a
            href={ `https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=WikiDaheim-at&categories=${ commonscat }&descriptionlang=de` }
            target='_blank'
            rel='noopener noreferrer'
            className='CityInfo-UploadButton'
          >
            <FormattedMessage
              id='uploadPhoto'
              description='Text for Photo Upload-Button'
              defaultMessage='Foto hochladen'
            />
          </a>
          <button
            className='CityInfo-Toggle'
            onClick={ this.toggle }
          />
        </header>
        <div className='CityInfo-Content'>
          <footer className='CityInfo-Content-Links'>
            <button
              className='CityInfo-Link'
              onClick={ () => this.setState({ 'shownLink': 'regio' }) }
            >
              <FormattedMessage
                id='cityinfo.regiowikiTitle'
                description='Title for RegioWiki'
                defaultMessage='RegioWiki'
              />
            </button>
          </footer>
        </div>
        { externalLinkOverlay }
      </section>
    );
  }

}

export default CityInfo;
