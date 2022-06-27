import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Immutable from 'immutable';

import { loadCategories } from 'redux/actions/app';

import Map from './Map';
import Sidebar from './Sidebar';

// import Icon from 'components/Global/Icon';


class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    // from react-redux connect
    dispatch: PropTypes.func,
    activeFilters: PropTypes.object,
    categories: PropTypes.instanceOf(Immutable.List),
    items: PropTypes.instanceOf(Immutable.List),
    mobileView: PropTypes.string,
    campaign: PropTypes.string,
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(loadCategories());
  }

  render() {
    const { items, categories, activeFilters, mobileView, campaign } = this.props;

    const filteredItems = items.filter((item) => {
      const itemCategories = categories.filter((c) => item.get('categories') ? item.get('categories').includes( c.get('name') ) && c.get('show') : true ); // check if category exists for saved legacy states

      if(itemCategories.size === 0) {
        return false;
      }

      if (activeFilters.size === 0) return true;

      // check which filter is active and if the item qualifies
      let qualified = false;
      if (activeFilters.includes('incomplete') && !item.get('complete')) qualified = true;
      if (activeFilters.includes('missing_images') && !item.get('foto')) qualified = true;
      if (activeFilters.includes('missing_description') && !item.get('beschreibung')) qualified = true;
      return qualified;
    });

    const resultViewClasses = classNames(
      'ResultView', {
        'ResultView-Map': mobileView === 'map',
        'ResultView-List': mobileView === 'list',
      }
    );

    return (
      <div className='Dashboard'>
        <div className='Dashboard-Content'>
          <div className={ resultViewClasses }>
            <Sidebar items={ filteredItems } campaign={campaign} />
            {categories.size > 0 ? <Map items={ filteredItems } campaign={campaign} /> : null }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  activeFilters: state.app.get('activeFilters'),
  categories: state.app.get('categories'),
  items: state.app.get('items'),
  placeSelected: state.app.get('placeSelected'),
  mobileView: state.app.get('mobileView'),
}), null, null)(Dashboard);
