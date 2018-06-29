import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toggleSyncListAndMap } from 'actions/app';
import { FormattedMessage } from 'react-intl';

@connect(state => ({
  syncListAndMap: state.app.get('syncListAndMap'),
}))
class FocusHandler extends Component {
  static propTypes = {
    syncListAndMap: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { dispatch } = this.props;

    dispatch(toggleSyncListAndMap());
  }

  render() {
    const { syncListAndMap } = this.props;

    const classnames = classNames(
      'SyncListToggle-Button', {
        'SyncListToggle-Button--active': syncListAndMap,
      }
    );

    return (
      <div className='SyncListToggle'>
        <FormattedMessage
          id='map.toggleSyncListAndMap'
          description='Text for the Sync List and Map Toggle-Button'
          defaultMessage='Liste beim Verschieben der Karte synchronisieren'
        >
          {(text) => (
            <button // eslint-disable-line jsx-a11y/no-static-element-interactions
              className={ classnames }
              onClick={ this.handleClick }
            >
              { text }
            </button>
          )}
        </FormattedMessage>
      </div>
    );
  }
}

export default FocusHandler;
