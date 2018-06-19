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
      const latlong = placeMapData.get('geometry').get('coordinates');
      switch (this.state.shownLink) {
        case 'bilder': {
          const title = (<FormattedMessage
            id='cityinfo.imageRequestsTitle'
            description='Title for Image Requests'
            defaultMessage='Bilderwünsche'
          />);

          const text = (<FormattedMessage
            id='cityinfo.imageRequestsText'
            description='Text for Image Requests'
            defaultMessage='Die Bilderwünsche zeigen dir Wünsche für Fotos aus
            der Wikipedia an, die  interessante Objekte oder Naturlandschaften
            in deiner Umgebung auflisten. Du kannst die gemachten Bilder
            entweder direkt über Wikipedia oder auch über WikiDaheim hochladen.'
          />);

          externalLinkOverlay = (<ExternalLinkOverlay
            title={ title }
            text={ text }
            link={ `https://tools.wmflabs.org/request/bwAPI/map.php?lat=${ latlong.get(1) }&lon=${ latlong.get(0) }&dist=10` }
            closeAction={ () => this.setState({ 'shownLink': null }) }
          />);
          break;
        }
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

        case 'bau': {
          const title = (<FormattedMessage
            id='cityinfo.construtionHistoryTitle'
            description='Title for Construction History'
            defaultMessage='Baugeschichte'
          />);

          const text = (<FormattedMessage
            id='cityinfo.construtionHistoryText'
            description='Text for Construction History'
            defaultMessage='Das Projekt Baugeschichte.at soll Bewusstsein für
            die Umgebung schaffen und Veränderungen im Ortsbild sichtbar machen.
            Es soll Informationen über die Häuser und ihre Geschichten bieten.
            Dabei ist es möglich jedes Gebäude in der Straße zu erfassen - das
            Projekt soll die Lücke zwischen relevanten (denkmalgeschützten)
            Gebäuden, und denen die unter keinem Schutz stehen, aber trotzdem
            für den Ort interessant sind, schließen. Angefangen hat das Projekt
            in Graz, mittlerweile ist es aber auch möglich andere Orte
            einzutragen. Das können angemeldete User via Formular machen.
            Über die Mediawiki-API ist auch eine App für mobile Geräte
            angebunden.'
          />);

          externalLinkOverlay = (<ExternalLinkOverlay
            title={ title }
            text={ text }
            link={ 'http://www.baugeschichte.at/Hilfe:Inhaltsverzeichnis' }
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
          <div className='CityInfo-Content-Top'>
            <FormattedMessage
              id='cityinfo.description'
              description='Description of the Cityinfo-Section (will be removed soon)'
              defaultMessage='Hier kannst du Bilder zu {cityName} hochladen.
              Weiters kannst du Abschnitte zum Wikipedia-Artikel
              dieser Gemeinde bearbeiten oder sogar anlegen,
              wenn sie fehlen sollten!<br />
              Unterhalb stehen einige Vorschläge zu Objekten,
              die du in {cityName} fotografieren könntest.'
              values={ { cityName } }
            >
              { (text) => (<div className='CityInfo-Text'>{ text }</div>) }
            </FormattedMessage>

            <div className='CityInfo-Sections'>
              <h2>
                <FormattedMessage
                  id='cityinfo.articleSections'
                  description='Text for Article Sections-Headline'
                  defaultMessage='Artikelabschnitte'
                />
              </h2>
              { currentArticle.get('sections').map((section) => (
                <CityInfoSection
                  name={ section.get('name') }
                  inArticle={ section.get('inArticle') }
                  editLink={ section.get('editLink') }
                  key={ section.get('name') }
                />
              )) }
            </div>
          </div>
          <footer className='CityInfo-Content-Links'>
            <button
              className='CityInfo-Link'
              onClick={ () => this.setState({ 'shownLink': 'bilder' }) }
            >
              <FormattedMessage
                id='cityinfo.imageRequestsTitle'
                description='Title for Image Requests'
                defaultMessage='Bilderwünsche'
              />
            </button>
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
            <button
              className='CityInfo-Link'
              onClick={ () => this.setState({ 'shownLink': 'bau' }) }
            >
              <FormattedMessage
                id='cityinfo.construtionHistoryTitle'
                description='Title for Construction History'
                defaultMessage='Baugeschichte'
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
