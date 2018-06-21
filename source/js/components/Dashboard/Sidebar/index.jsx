import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResultList from './ResultList';
import SearchBar from './SearchBar';
import CityInfo from './CityInfo';

@connect(state => ({
  placeSelected: state.app.get('placeSelected'),
}))
class Sidebar extends Component {
  static propTypes = {
    placeSelected: PropTypes.bool,
    items: PropTypes.object,
  };

  render() {
    const { items } = this.props;

    return (
      <div className='ResultList'>
        <SearchBar />
        <CityInfo />
        <ResultList items={ items } />
      </div>
    );
  }
}

export default Sidebar;
