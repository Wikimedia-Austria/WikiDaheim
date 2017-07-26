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

    const ItemClass = classNames({
      'CityInfo': true,
      'CityInfo--opened': showCityInfo,
    });

    return (
      <section className={ ItemClass }>
        <header className='CityInfo-Header'>
          <h1>{ cityName }</h1>
          <a
            href={ `https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=WikiDaheim&categories=${ commonscat }` }
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
          <div className='CityInfo-Text'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Ut congue elit odio. Nulla urna eros, dignissim at volutpat ac,
            fermentum ut risus. Suspendisse vitae arcu nibh. Cras elit diam,
            rhoncus sed blandit vitae, ultricies et nisl.
            Vivamus sollicitudin massa nec pretium faucibus. Suspendisse nec interdum dui.
            Phasellus scelerisque justo eget faucibus luctus.
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
      </section>
    );
  }

}

export default CityInfo;
