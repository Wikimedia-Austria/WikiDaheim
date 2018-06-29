import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilterTitle from './FilterTitle';
import FilterList from './FilterList';

class Filter extends Component {
  static propTypes = {
    items: PropTypes.object,
  };

  render() {
    const { items } = this.props;

    return (
      <div className='FilterWrapper'>
        <FilterTitle items={ items } />
        <FilterList />
      </div>
    );
  }
}

export default Filter;
