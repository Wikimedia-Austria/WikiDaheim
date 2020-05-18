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
    placeSelected: PropTypes.bool,
    items: PropTypes.object,
  };

  render() {
    const { placeSelected, items } = this.props;

    return (
      <div className='ResultList'>
        <div className='upperContent'>
          <SearchBar />

          {placeSelected ? <CityInfo /> : null}
          {placeSelected ? <Filter items={ items } /> : null}
        </div>

        {placeSelected ? <ResultList items={ items } /> : <Page page={ { slug: 'index' } } />}
        <FocusHandler view='list' />
      </div>
    );
  }
}

export default connect(state => ({
  placeSelected: state.app.get('placeSelected'),
}))(Sidebar);
