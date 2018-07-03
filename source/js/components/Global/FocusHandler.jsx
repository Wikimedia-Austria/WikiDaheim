import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mobileViewSwitch } from 'actions/app';

@connect(state => ({
  currentMobileView: state.app.get('mobileView'),
}))
class FocusHandler extends Component {
  static propTypes = {
    currentMobileView: PropTypes.string,
    view: PropTypes.string,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { dispatch, view } = this.props;

    dispatch(mobileViewSwitch(view));

    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { currentMobileView, view } = this.props;

    const classnames = classNames(
      'FocusHandler',
      `FocusHandler-${ view }`, {
        'FocusHandler--current': currentMobileView === view,
        'FocusHandler--ready': currentMobileView !== view,
      }
    );

    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={ classnames }
        onClick={ this.handleClick }
        onTouchMove={ this.handleClick }
      />
    );
  }
}

export default FocusHandler;
