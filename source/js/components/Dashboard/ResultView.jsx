import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResultMap from './ResultView/ResultMap';
import ResultList from './ResultView/ResultList';

@connect(state => ({
  activeFilters: state.app.get('activeFilters'),
  categories: state.app.get('categories'),
  categoriesLoading: state.app.get('categoriesLoading'),
  items: state.app.get('items'),
  placeSelected: state.app.get('placeSelected'),
}))
class ResultView extends Component {
  static propTypes = {
    // categories: PropTypes.array,
    activeFilters: PropTypes.object,
    categories: PropTypes.object,
    categoriesLoading: PropTypes.bool,
    items: PropTypes.array,
  };

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

    if (categories.toJS().length === 0 || categoriesLoading) return null;

    return (<div className='ResultView'>
      <ResultList items={ filteredItems } />
      <ResultMap items={ filteredItems } />
    </div>);
  }

}

export default ResultView;
