import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { toggleFilterMenu } from 'actions/menu';

@connect(state => {
  let filtersActive = false;
  const activeFilters = state.app.get('activeFilters');
  const categories = state.app.get('categories');

  if (activeFilters.size > 0) filtersActive = true;
  if (categories.find((c) => !c.get('show'))) filtersActive = true;

  return {
    showFilterMenu: state.menu.get('showFilterMenu'),
    filtersActive,
  };
})
class FilterButton extends Component {
  static propTypes = {
    showFilterMenu: PropTypes.bool,
    filtersActive: PropTypes.bool,

    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { dispatch } = this.props;

    dispatch(toggleFilterMenu());
  }

  render() {
    const { showFilterMenu, filtersActive } = this.props;

    const ItemClass = classNames({
      'FilterButton': true,
      'FilterButton--open': showFilterMenu,
      'FilterButton--filtersActive': filtersActive,
    });

    return (
      <button
        className={ ItemClass }
        onClick={ this.toggle }
      >
        <span>List filtern</span>
      </button>
    );
  }

}

export default FilterButton;
