import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FocusHandler from 'components/Global/FocusHandler';
import Page from 'components/Page';
import ResultList from './ResultList';
import SearchBar from './SearchBar';
import CityInfo from './CityInfo';
import Filter from './Filter';


class Sidebar extends Component {
  static propTypes = {
    placeLoading: PropTypes.bool,
    placeLoaded: PropTypes.bool,
    items: PropTypes.object,
    campaign: PropTypes.string,
  };

  render() {
    const { placeSelected, placeLoading, items, campaign } = this.props;

    return (
      <div className='ResultList'>
        <div className='upperContent'>
          <SearchBar campaign={campaign} />

          {placeSelected ? <CityInfo /> : null}
          {placeSelected && !placeLoading ? <Filter items={ items } /> : null}
        </div>

        {placeSelected ? !placeLoading ? <ResultList items={ items } /> : null : <Page page={ { slug: campaign === 'burgenland' ? 'burgenland' : 'index' } } />}
        <FocusHandler view='list' />
      </div>
    );
  }
}

export default connect(state => ({
  placeSelected: state.app.get('placeSelected'),
  placeLoading: state.app.get('placeLoading'),
}))(Sidebar);
