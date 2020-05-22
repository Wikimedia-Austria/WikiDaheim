import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toggleCategory } from 'redux/actions/app';
import CategoryName from 'components/Global/CategoryName';
import { Base64 } from 'js-base64';
import { injectIntl } from 'react-intl';

class CategoryFilterItem extends Component {
  static propTypes = {
    category: PropTypes.object,
    asIcon: PropTypes.bool,
    // from react-redux connect
    dispatch: PropTypes.func,
    intl: PropTypes.any,
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
    const { category, asIcon, intl } = this.props;

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

    const categoryName = intl.formatMessage({ id: `category.${ category.get('name') }` });

    return (
      <div
        className={ ItemClass }
        style={ style }
      >
        <button onClick={ this.toggle } title={ categoryName }>
          <CategoryName category={ category } />
        </button>
      </div>
    );
  }

}

export default connect()(injectIntl(CategoryFilterItem));
