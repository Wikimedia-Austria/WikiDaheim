import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import { toggleMenu } from "/src/redux/actions/menu";

class MenuToggle extends Component {
  static propTypes = {
    showMenu: PropTypes.bool,
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    const { dispatch } = this.props;

    dispatch(toggleMenu());
  }

  render() {
    const { showMenu } = this.props;

    const btnClass = classNames({
      "Menu-toggle": true,
      "Menu-toggle--active": showMenu,
    });

    return (
      <button
        type="button"
        className={btnClass}
        onClick={this.handleToggleClick}
      >
        <span />
        <span />
        <span />
      </button>
    );
  }
}

export default connect((state) => ({
  showMenu: state.menu.get("showMenu"),
}))(MenuToggle);
