import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { toggleFilter } from 'actions/app';

@connect(state => ({
  activeFilters: state.app.get('activeFilters'),
}))
class PropertyFilterItem extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    activeFilters: PropTypes.instanceOf(Set),

    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { id, dispatch } = this.props;

    dispatch(toggleFilter(id));
  }

  render() {
    const { title, id, activeFilters } = this.props;
    const isActive = activeFilters.includes(id);

    const ItemClass = classNames({
      'PropertyFilter-Item': true,
      'PropertyFilter-Item--active': isActive,
    });

    return (
      <button
        className={ ItemClass }
        onClick={ this.toggle }
      >
        { title }
        <span />
      </button>
    );
  }

}

export default PropertyFilterItem;
