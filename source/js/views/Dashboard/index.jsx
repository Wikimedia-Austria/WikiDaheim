import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadCategories } from 'actions/app';

import DashboardHeader from 'components/Dashboard/DashboardHeader';
import ResultView from 'components/Dashboard/ResultView';

// import Icon from 'components/Global/Icon';

@connect(() => ({}), null, null, { pure: false })
export default class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    // from react-redux connect
    dispatch: PropTypes.func,
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(loadCategories());
  }

  render() {
    return (
      <div className='Dashboard'>
        <DashboardHeader />
        <div className='Dashboard-Content'>
          <ResultView />
        </div>
      </div>
    );
  }
}


/*
  <h3>SVG sprite icon tests</h3>
  <div className='Example'>
    <Icon glyph='square' />
    <Icon glyph='circle' />
    <Icon glyph='triangle' />
    <Icon glyph='marker_single' />
    <Icon glyph='marker_cluster' />
  </div>
*/
