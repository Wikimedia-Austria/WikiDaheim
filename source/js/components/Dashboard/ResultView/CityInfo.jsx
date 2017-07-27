import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleCityInfo } from 'actions/app';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import classNames from 'classnames';
import CityInfoSection from './CityInfoSection';

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
      let popupText = {
        title: 'Bilderwünsche',
        text: 'Die Bilderwünsche zeigen dir Wünsche für Fotos aus der Wikipedia an, die  interessante Objekte oder Naturlandschaften in deiner Umgebung auflisten. Du kannst die gemachten Bilder entweder direkt über Wikipedia oder auch über WikiDaheim hochladen.',
        link: `https://tools.wmflabs.org/request/bwAPI/map.php?lat=${ latlong.get(1) }&lon=${ latlong.get(0) }&dist=10`,
      };
      switch (this.state.shownLink) {
        case 'regio':
          popupText = {
            title: 'RegioWiki',
            text: 'Im RegioWiki kannst du all jene Themen deiner Umgebung beschreiben, die nicht von großem überregionalem Interesse sind, aber für deine Gemeinde eine Bedeutung haben. Dazu zählen etwa die heimische Blasmusikkapelle, die Beschreibung des jährlichen Kirtags oder die Chronologie der Umzüge im Ort. Du kannst dich auf Regiowiki einfach registrieren und danach sofort loslegen!',
            link: `http://regiowiki.at/wiki/${ currentArticle.get('source') }`,
          };
          break;

        case 'bau':
          popupText = {
            title: 'Baugeschichte',
            text: 'Das Projekt Baugeschichte.at soll Bewusstsein für die Umgebung schaffen und Veränderungen im Ortsbild sichtbar machen. Es soll Informationen über die Häuser und ihre Geschichten bieten. Dabei ist es möglich jedes Gebäude in der Straße zu erfassen - das Projekt soll die Lücke zwischen relevanten (denkmalgeschützten) Gebäuden, und denen die unter keinem Schutz stehen, aber trotzdem für den Ort interessant sind, schließen. Angefangen hat das Projekt in Graz, mittlerweile ist es aber auch möglich andere Orte einzutragen. Das können angemeldete User via Formular machen. Über die Mediawiki-API ist auch eine App für mobile Geräte angebunden.',
            link: 'http://www.baugeschichte.at/Hilfe:Inhaltsverzeichnis',
          };
          break;

        default:
      }

      externalLinkOverlay = (
        <div
          className='ExternalLink-Overlay'
          onClick={ () => this.setState({ 'shownLink': null }) } //eslint-disable-line
        >
          <div
            className='ExternalLink-Overlay-Inner'
            onClick={(e) => e.stopPropagation()} //eslint-disable-line
          >
            <button
              className='ExternalLink-Close'
              onClick={ () => this.setState({ 'shownLink': null }) }
            >
              Abbrechen
            </button>
            <h1>{ popupText.title }</h1>
            <p>{ popupText.text }</p>
            <a
              href={ popupText.link }
              target='_blank'
              rel='noopener noreferrer'
              onClick={ () => this.setState({ 'shownLink': null }) }
            >
              Seite öffnen
            </a>
          </div>
        </div>
      );
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
            href={ `https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=WikiDaheim-at&categories=${ commonscat }` }
            target='_blank'
            rel='noopener noreferrer'
            className='CityInfo-UploadButton'
          >
            Foto hochladen
          </a>
          <button
            className='CityInfo-Toggle'
            onClick={ this.toggle }
          />
        </header>
        <div className='CityInfo-Content'>
          <div className='CityInfo-Content-Top'>
            <div className='CityInfo-Text'>
              Hier kannst du Bilder zu { cityName } hochladen.
              Weiters kannst du Abschnitte zum Wikipedia-Artikel
              dieser Gemeinde bearbeiten oder sogar anlegen,
              wenn sie fehlen sollten!<br />
              Unterhalb stehen einige Vorschläge zu Objekten,
              die du in { cityName } fotografieren könntest.
            </div>
            <div className='CityInfo-Sections'>
              <h2>Artikelabschnitte</h2>
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
              Bilderwünsche
            </button>
            <button
              className='CityInfo-Link'
              onClick={ () => this.setState({ 'shownLink': 'regio' }) }
            >
              RegioWiki
            </button>
            <button
              className='CityInfo-Link'
              onClick={ () => this.setState({ 'shownLink': 'bau' }) }
            >
              Baugeschichte
            </button>
          </footer>
        </div>
        { externalLinkOverlay }
      </section>
    );
  }

}

export default CityInfo;
