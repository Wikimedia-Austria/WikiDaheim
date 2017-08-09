import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SearchBar from 'components/Dashboard/SearchBar';
import Filter from 'components/Dashboard/Filter';

@connect(state => ({
  placeSelected: state.app.get('placeSelected'),
}))
export default class DashboardHeader extends Component {
  static propTypes = {
    placeSelected: PropTypes.bool,
  };

  render() {
    const { placeSelected } = this.props;
    return (
      <div className='DashboardHeader'>
        <SearchBar />
        {placeSelected ? <Filter /> : null}
      </div>
    );
  }
}
