import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import geolib from 'geolib';
import Infinite from 'react-infinite';
import { placeItemHover, placeItemLeave, placeItemSelect } from 'actions/app';
import scrollTo from 'lib/ScrollTo';
import ResultListItem from './ResultListItem';
import CityInfo from './CityInfo';

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
      containerHeight: 500,
    };

    this.hoverItem = this.hoverItem.bind(this);
    this.leaveItem = this.leaveItem.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
  }

  componentDidMount() {
    this.updateHeight();
    window.addEventListener('resize', this.updateHeight);
  }

  componentWillUpdate(nextProps) {
    const { items } = nextProps;
    const currentSelected = this.props.selectedElement;
    const nextSelected = nextProps.selectedElement;

    if (
      (!currentSelected && nextSelected) ||
      (currentSelected && currentSelected.get('lastChange') !== nextSelected.get('lastChange'))
    ) {
      const list = document.getElementsByClassName('ResultList-List')[0];
      const currentIndex = items.findIndex((item) => item.get('id') === nextSelected.get('id'));

      if (parseFloat(nextSelected.get('longitude')) > 0.0) {
        scrollTo(list, 0, 1000);
      } else {
        scrollTo(list, currentIndex * 130, 1000);
      }
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

  selectItem(item) {
    const { dispatch } = this.props;

    dispatch(placeItemSelect(item, 'list'));
  }

  updateHeight() {
    const container = document.getElementsByClassName('ResultList');

    if (container.length > 0) {
      this.setState({ containerHeight: container[0].clientHeight });
    }
  }

  render() {
    const { items, categories, currentMapPosition, hoveredElement, selectedElement } = this.props;

    const itemsWithDistance = items.map((item) => {
      try {
        return item.merge({ distance: geolib.getDistanceSimple(
          {
            latitude: currentMapPosition.get(1),
            longitude: currentMapPosition.get(0),
          },
          {
            latitude: item.get('latitude'),
            longitude: item.get('longitude'),
          }
        ) });
      } catch (err) {
        return item.merge({ distance: 100000 });
      }
    });

    const sortedItems = itemsWithDistance.sort((a, b) => {
      if (a.get('distance') < b.get('distance')) { return -1; }
      if (a.get('distance') > b.get('distance')) { return 1; }
      return 0;
    });

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
    );
  }

}

export default ResultList;
