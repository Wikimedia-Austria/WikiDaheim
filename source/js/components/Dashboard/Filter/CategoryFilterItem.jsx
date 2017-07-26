import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toggleCategory } from 'actions/app';

@connect()
class CategoryFilterItem extends Component {
  static propTypes = {
    category: PropTypes.object,
    // from react-redux connect
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { dispatch, category } = this.props;

    dispatch(toggleCategory(category.get('name')));
  }


  render() {
    const { category } = this.props;

    const ItemClass = classNames({
      'CategoryFilter-Item': true,
      'CategoryFilter-Item--active': category.get('show'),
    });

    return (
      <div
        className={ ItemClass }
        style={ { backgroundColor: category.get('color') } }
      >
        <button onClick={ this.toggle }>
          { category.get('title') }
        </button>
      </div>
    );
  }

}

export default CategoryFilterItem;
