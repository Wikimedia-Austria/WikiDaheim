import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import Infinite from 'react-infinite';
import { placeItemHover, placeItemLeave, placeItemSelect } from 'actions/app';
import scrollTo from 'lib/ScrollTo';
import ResultListItem from './ResultListItem';
import CityInfo from './CityInfo';
import DistanceSort from 'worker-loader!workers/distanceSort.js'; //eslint-disable-line

@connect(state => ({
  currentMapPosition: state.app.get('currentMapPosition'),
  hoveredElement: state.app.get('hoveredElement'),
  selectedElement: state.app.get('selectedElement'),
  categories: state.app.get('categories'),
}))
class ResultList extends Component {
  static propTypes = {
    currentMapPosition: PropTypes.object,
    hoveredElement: PropTypes.object,
    selectedElement: PropTypes.object,
    categories: PropTypes.object,
    items: PropTypes.object,
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      containerHeight: 5,
      sortedList: new List(),
    };

    this.hoverItem = this.hoverItem.bind(this);
    this.leaveItem = this.leaveItem.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
  }

  componentWillMount() {
    this.worker = new DistanceSort();
  }

  componentDidMount() {
    const { items, currentMapPosition } = this.props;

    this.updateHeight();
    window.addEventListener('resize', this.updateHeight);

    this.worker.postMessage({
      currentMapPosition: currentMapPosition.toJS(),
      items: items.toJS(),
    });
  }

  componentWillUpdate(nextProps, nextState) {
    // scroll top when list reorders
    if (
      nextState.sortedList &&
      this.state.sortedList &&
      this.state.sortedList.size > 0 &&
      nextState.sortedList.size > 0 &&
      this.state.sortedList.get(0).get('id') !== nextState.sortedList.get(0).get('id')
    ) {
      this.scrollTop();
      this.updateHeight();
    }

    // check if we get a new list
    if (
      this.props.currentMapPosition !== nextProps.currentMapPosition ||
      this.props.items !== nextProps.items
    ) {
      this.worker.postMessage({
        currentMapPosition: nextProps.currentMapPosition.toJS(),
        items: nextProps.items.toJS(),
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeight);
  }

  hoverItem(item) {
    const { dispatch } = this.props;

    dispatch(placeItemHover(item));
  }

  leaveItem() {
    const { dispatch } = this.props;

    dispatch(placeItemLeave());
  }

  scrollTop() {
    const list = document.getElementsByClassName('ResultList-List')[0];
    scrollTo(list, 0, 1000);
  }

  selectItem(item) {
    const { dispatch } = this.props;

    dispatch(placeItemSelect(item, 'list'));
  }

  updateHeight() {
    const container = document.getElementsByClassName('ResultList-ListWrapper');

    if (container.length > 0) {
      this.setState({ containerHeight: container[0].clientHeight });
    }
  }

  render() {
    const { categories, hoveredElement, selectedElement } = this.props;
    const sortedItems = this.state.sortedList;

    this.worker.onmessage = (m) => this.setState({ sortedList: fromJS(m.data) });

    const isHovered = (item) => {
      if (hoveredElement && item.get('id') === hoveredElement.get('id')) return true;
      return false;
    };

    const isSelected = (item) => {
      if (selectedElement && item.get('id') === selectedElement.get('id')) return true;
      return false;
    };

    const getCategoryColor = (item) => {
      const category = categories.find((c) => c.get('name') === item.get('category'));
      return category.get('color');
    };

    return (
      <div className='ResultList'>
        <CityInfo />

        <div className='ResultList-ListWrapper'>
          <Infinite containerHeight={ this.state.containerHeight } elementHeight={ 130 } className='ResultList-List'>
            { sortedItems.map((item) => (
              <ResultListItem
                item={ item }
                categoryColor={ getCategoryColor(item) }
                isHovered={ isHovered(item) }
                isSelected={ isSelected(item) }
                onHover={ () => this.hoverItem(item) }
                onLeave={ () => this.leaveItem() }
                onClick={ () => this.selectItem(item) }
                key={ item.get('id') }
              />
            )) }
          </Infinite>
        </div>
      </div>
    );
  }

}

export default ResultList;
