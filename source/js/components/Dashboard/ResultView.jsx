import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResultMap from './ResultView/ResultMap.jsx';

@connect(state => {
  const categories = state.app.get('categories');
  const items = state.app.get('items').filter((item) => {
    return categories.find((c) => c.get('name') === item.get('category')).get('show');
  });

  return {
    categories,
    items,
    placeSelected: state.app.get('placeSelected'),
  };
})
class ResultView extends Component {
  static propTypes = {
    // categories: PropTypes.array,
    items: PropTypes.array,
    placeSelected: PropTypes.bool,
    // from react-redux connect
    // dispatch: PropTypes.func,
  };

  render() {
    const { items, placeSelected } = this.props;

    let resMap = <div>Hello World!</div>;
    if (placeSelected) resMap = <ResultMap items={ items } />;

    return resMap;
  }

}

export default ResultView;
