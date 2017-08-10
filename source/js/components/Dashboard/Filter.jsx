import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { toggleFilterMenu } from 'actions/menu';
import CategoryFilter from './Filter/CategoryFilter';
import PropertyFilter from './Filter/PropertyFilter';

@connect(state => {
  return {
    showFilterMenu: state.menu.get('showFilterMenu'),
  };
})
class Filter extends Component {
  static propTypes = {
    showFilterMenu: PropTypes.bool,

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
    const { showFilterMenu } = this.props;

    const ItemClass = classNames({
      'FilterSection': true,
      'FilterSection--active': showFilterMenu,
    });

    return (
      <section className={ ItemClass }>
        <h1>Filter</h1>
        <h2>Themen</h2>
        <CategoryFilter />

        <h2>Eigenschaften</h2>
        <PropertyFilter />

        <footer>
          <button
            className='FilterFinished-Button'
            onClick={ this.toggle }
          >
            Fertig ✔
          </button>
        </footer>
      </section>
    );
  }

}

export default Filter;
