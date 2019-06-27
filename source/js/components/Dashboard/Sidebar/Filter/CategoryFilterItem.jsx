import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toggleCategory } from 'actions/app';
import CategoryName from 'components/Global/CategoryName';
import { Base64 } from 'js-base64';

@connect()
class CategoryFilterItem extends Component {
  static propTypes = {
    category: PropTypes.object,
    asIcon: PropTypes.bool,
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
    const { category, asIcon } = this.props;

    const ItemClass = classNames({
      'CategoryFilter-Item': true,
      'CategoryFilter-Item-Icon': asIcon,
      'CategoryFilter-Item--active': category.get('show'),
      'CategoryFilter-Item--inactive': !category.get('show'),
    });

    const style = {};

    if (asIcon) {
      const icon = category.get('icon');
      style.backgroundImage = `url('data:image/svg+xml;base64,${ Base64.encode(icon) }')`;
    } else {
      style.backgroundColor = category.get('color');
    }

    return (
      <div
        className={ ItemClass }
        style={ style }
      >
        <button onClick={ this.toggle }>
          <CategoryName category={ category } />
        </button>
      </div>
    );
  }

}

export default CategoryFilterItem;
