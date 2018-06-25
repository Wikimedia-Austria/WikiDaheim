import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResultList from './ResultList';
import SearchBar from './SearchBar';
import CityInfo from './CityInfo';
import Filter from './Filter';

@connect(state => ({
  placeSelected: state.app.get('placeSelected'),
}))
class Sidebar extends Component {
  static propTypes = {
    placeSelected: PropTypes.bool,
    items: PropTypes.object,
  };

  render() {
    const { placeSelected, items } = this.props;

    return (
      <div className='ResultList'>
        <SearchBar />

        {placeSelected ? <CityInfo /> : null}
        {placeSelected ? <Filter items={ items } /> : null}
        {placeSelected ? <ResultList items={ items } /> : null}
      </div>
    );
  }
}

export default Sidebar;
