import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import CategoryFilterItem from './CategoryFilterItem';
import Immutable from 'immutable';

class CategoryFilter extends Component {
  static propTypes = {
    asIcons: PropTypes.bool,
    categories: PropTypes.instanceOf(Immutable.List),
  };

  render() {
    const {
      categories,
      asIcons,
    } = this.props;

    // check if every single item is selected
    const allSelected = !categories.find((c) => !c.get('show'));

    const ItemClass = classNames({
      'CategoryFilter': true,
      'CategoryFilter-Icons': asIcons,
      'CategoryFilter--all-active': allSelected,
    });

    return (
      <div className={ ItemClass }>
        {categories.map((category) => <CategoryFilterItem
          category={ category }
          key={ category.get('name') }
          asIcon={ asIcons }
        />)}
      </div>
    );
  }

}

export default connect(state => ({
  categories: state.app.get('categories'),
}))(CategoryFilter);
