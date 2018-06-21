import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadCategories } from 'actions/app';

import Map from './Map';
import Sidebar from './Sidebar';

// import Icon from 'components/Global/Icon';

@connect(state => ({
  activeFilters: state.app.get('activeFilters'),
  categories: state.app.get('categories'),
  categoriesLoading: state.app.get('categoriesLoading'),
  items: state.app.get('items'),
  placeSelected: state.app.get('placeSelected'),
}), null, null, { pure: false })
export default class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    // from react-redux connect
    dispatch: PropTypes.func,
    activeFilters: PropTypes.object,
    categories: PropTypes.object,
    categoriesLoading: PropTypes.bool,
    items: PropTypes.array,
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(loadCategories());
  }

  render() {
    const { items, categories, activeFilters, categoriesLoading } = this.props;

    const filteredItems = items.filter((item) => {
      const itemCategory = categories.find((c) => c.get('name') === item.get('category'));
      if (itemCategory && !itemCategory.get('show')) return false;
      if (activeFilters.size === 0) return true;

      // check which filter is active and if the item qualifies
      let qualified = false;
      if (activeFilters.includes('incomplete') && !item.get('complete')) qualified = true;
      if (activeFilters.includes('missing_images') && !item.get('foto')) qualified = true;
      if (activeFilters.includes('missing_description') && !item.get('beschreibung')) qualified = true;
      return qualified;
    });

    return (
      <div className='Dashboard'>
        <div className='Dashboard-Content'>
          <div className='ResultView'>
            <Sidebar items={ filteredItems } />
            {categories.size > 0 ? <Map items={ filteredItems } /> : null }
          </div>
        </div>
      </div>
    );
  }
}
