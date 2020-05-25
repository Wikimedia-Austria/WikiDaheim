import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toggleClustering } from 'redux/actions/app';
import { FormattedMessage } from 'react-intl';

class EnableClusteringToggle extends Component {
  static propTypes = {
    enableClustering: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { dispatch } = this.props;

    dispatch(toggleClustering());
  }

  render() {
    const { enableClustering } = this.props;

    const classnames = classNames(
      'EnableClusteringToggle-Button', {
      'EnableClusteringToggle-Button--active': enableClustering,
      }
    );

    return (
      <div className='EnableClusteringToggle'>
        <FormattedMessage
          id='map.enableClustering'
          description='Text for the "Enable Map Clustering" Toggle-Button'
          defaultMessage='Objekte clustern'
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

export default connect(state => ({
  enableClustering: state.app.get('enableClustering'),
}))(EnableClusteringToggle);
