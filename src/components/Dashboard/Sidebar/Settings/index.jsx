import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import EnableClusteringToggle from "./EnableClusteringToggle";
import MapSyncToggle from "./MapSyncToggle";
import { toggleSettings } from "/src/redux/actions/menu";

class Settings extends Component {
  static propTypes = {
    showSettings: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  render() {
    const { showSettings, dispatch } = this.props;

    const classnames = classNames("SettingsPanel", {
      "SettingsPanel--active": showSettings,
    });

    return (
      <>
        <button
          className="CityInfo-Link CityInfo-Link--right"
          onClick={() => dispatch(toggleSettings())}
        >
          <FormattedMessage
            id="settings.buttonTitle"
            description="Title for Settings-Button"
            defaultMessage="Optionen"
          />
        </button>

        <div className={classnames}>
          <MapSyncToggle />
          <EnableClusteringToggle />
        </div>
      </>
    );
  }
}

export default connect((state) => ({
  showSettings: state.menu.get("showSettings"),
}))(Settings);
