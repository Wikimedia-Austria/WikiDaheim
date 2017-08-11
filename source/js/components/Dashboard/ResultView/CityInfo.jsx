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
    this.handleTkkChange = this.handleTkkChange.bind(this);
    this.handleTkkPaste = this.handleTkkPaste.bind(this);
  }

  toggle() {
    const { dispatch } = this.props;

    dispatch(toggleCityInfo());
  }

  handleTkkChange(event) {
    this.setState({ tkk: event.target.value });
  }

  handleTkkPaste(event) {
    if (event.clipboardData) {
      const url = event.clipboardData.getData('text/plain');
      const match = url.match(/tirisdienste\.at.*info_(\d+)0\.htm/);
      if (match) {
        const tkk = match[1];
        this.setState({ tkk });
        event.preventDefault();
      }
    }
  }

  get isValidTkkProvided() {
    return this.state.tkk && this.state.tkk.match(/^[0-9]+$/);
  }

  render() {
    const { articles, placeMapData, showCityInfo, commonscat } = this.props;

    const cityName = placeMapData.get('text');
    const currentArticle = articles.get(0);
    const gkz = currentArticle.get('gemeindekennzahl');

    if (!currentArticle) return null;

    let externalLinkOverlay = null;

    if (this.state.shownLink) {
      const latlong = placeMapData.get('geometry').get('coordinates');
      let popupText;
      switch (this.state.shownLink) {
        case 'bilder':
          popupText = {
            content: <section>
              <h1>Bilderwünsche</h1>
              <p>Die Bilderwünsche zeigen dir Wünsche für Fotos aus der Wikipedia an,
                die interessante Objekte oder Naturlandschaften in deiner Umgebung auflisten.
                Du kannst die gemachten Bilder entweder direkt über Wikipedia oder
                auch über WikiDaheim hochladen.</p>
            </section>,
            link: `https://tools.wmflabs.org/request/bwAPI/map.php?lat=${ latlong.get(1) }&lon=${ latlong.get(0) }&dist=10`,
          };
          break;

        case 'regio':
          popupText = {
            content: <section>
              <h1>RegioWiki</h1>
              <p>Im RegioWiki kannst du all jene Themen deiner Umgebung beschreiben,
                die nicht von großem überregionalem Interesse sind, aber für deine Gemeinde
                eine Bedeutung haben. Dazu zählen etwa die heimische Blasmusikkapelle,
                die Beschreibung des jährlichen Kirtags oder die Chronologie der Umzüge im Ort.
                Du kannst dich auf Regiowiki einfach registrieren und danach sofort loslegen!</p>
            </section>,
            link: `http://regiowiki.at/wiki/${ currentArticle.get('source') }`,
          };
          break;

        case 'bau':
          popupText = {
            content: <section>
              <h1>Baugeschichte</h1>
              <p>Das Projekt Baugeschichte.at soll Bewusstsein für die Umgebung
                schaffen und Veränderungen im Ortsbild sichtbar machen. Es soll Informationen
                über die Häuser und ihre Geschichten bieten. Dabei ist es möglich jedes Gebäude
                in der Straße zu erfassen - das Projekt soll die Lücke zwischen relevanten
                (denkmalgeschützten) Gebäuden, und denen die unter keinem Schutz stehen,
                aber trotzdem für den Ort interessant sind, schließen. Angefangen hat das
                Projekt in Graz, mittlerweile ist es aber auch möglich andere Orte einzutragen.
                Das können angemeldete User via Formular machen. Über die Mediawiki-API ist
                auch eine App für mobile Geräte angebunden.</p>
            </section>,
            link: 'http://www.baugeschichte.at/Hilfe:Inhaltsverzeichnis',
          };
          break;

        case 'tkk':
          popupText = {
            closeOnClick: false,
            content: <section>
              <h1>Kunstkataster</h1>
              <p>Der Kunstkataster des Landes Tirol bietet eine systematische wissenschaftliche
                Inventarisierung des Kulturgüterbestandes von Nord- und Osttirol.</p>
            </section>,
            footer: <section>
              <p>…, Objekt heraussuchen und URL von Popup einfügen:</p>
              <p>
                <label htmlFor='tkkInput'>Inventarnummer: </label>
                <input
                  id='tkkInput'
                  type='text'
                  value={ this.state.tkk }
                  onChange={ this.handleTkkChange }
                  onPaste={ this.handleTkkPaste }
                />
              </p>
              <p><a
                href={ this.isValidTkkProvided ? `https://commons.wikimedia.org/wiki/special:uploadWizard?campaign=TKK&id=${ this.state.tkk }&categories=${ commonscat }&descriptionlang=de` : undefined }
                target='_blank'
                rel='noopener noreferrer'
                className={ this.isValidTkkProvided ? '' : 'inactive' }
              >
                Foto für ID { this.state.tkk } hochladen
              </a></p>
            </section>,
            link: `http://www.tirisdienste.at/scripts/esrimap.dll?Name=Kunst&RaumIdx0=0&RaumIdx2=0&RaumIdx1=${ gkz.replace(/^70/, '') }&ObjIdx=0&ObjIdx1=0&ObjIdx2=0&ZeitIdx=0&ZeitIdx1=0&KuenstIdx=0&KuenstIdx1=0&ObjOpt=1&Komb=1&ShowObj.x=0&ShowObj.x=8&ShowObj.y=13&MyAufl=1024`,
          };
          break;

        default:
      }

      externalLinkOverlay = (
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className='ExternalLink-Overlay'
          onClick={ () => this.setState({ 'shownLink': null }) }
        >
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className='ExternalLink-Overlay-Inner'
            onClick={ (e) => e.stopPropagation() }
          >
            <button
              className='ExternalLink-Close'
              onClick={ () => this.setState({ 'shownLink': null }) }
            >
              Abbrechen
            </button>
            { popupText.content }
            <p><a
              href={ popupText.link }
              target='_blank'
              rel='noopener noreferrer'
              onClick={ () => popupText.closeOnClick !== false && this.setState({ 'shownLink': null }) }
            >
              Seite öffnen
            </a></p>
            { popupText.footer }
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
            href={ `https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=WikiDaheim-at&categories=${ commonscat }&descriptionlang=de` }
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
            {
              gkz && gkz.match && gkz.match(/^70/) ? <button
                className='CityInfo-Link'
                onClick={ () => this.setState({ 'shownLink': 'tkk' }) }
              >
                Kunstkataster
              </button> : null
            }
          </footer>
        </div>
        { externalLinkOverlay }
      </section>
    );
  }

}

export default CityInfo;
