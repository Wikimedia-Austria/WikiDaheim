import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import Infinite from 'react-infinite';
import { placeItemHover, placeItemLeave, placeItemSelect } from 'actions/app';
import scrollTo from 'lib/scrollTo';
import { FormattedMessage } from 'react-intl';
import ResultListItem from './ResultListItem';
import DistanceSort from 'worker-loader!workers/distanceSort.js'; //eslint-disable-line

@connect(state => ({
  currentMapPosition: state.app.get('currentMapPosition'),
  hoveredElement: state.app.get('hoveredElement'),
  selectedElement: state.app.get('selectedElement'),
  categories: state.app.get('categories'),
  placeSelected: state.app.get('placeSelected'),
}))
class ResultList extends Component {
  static propTypes = {
    placeSelected: PropTypes.bool,
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
      inSelectTimeout: false,
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
    } else if (
        (!this.props.selectedElement && nextProps.selectedElement) ||
        (this.props.selectedElement.get('id') !== nextProps.selectedElement.get('id'))
      ) {
      const list = document.getElementsByClassName('ResultList-List')[0];
      const currentIndex = nextState.sortedList.findIndex((item) => item.get('id') === nextProps.selectedElement.get('id'));

      if (currentIndex && window.innerWidth < 770) {
        scrollTo(list, (currentIndex * 112) - 5, 400);
      }
    }

    // check if we get a new list
    if (
      (
        !this.state.inSelectTimeout &&
        this.props.currentMapPosition !== nextProps.currentMapPosition
      ) ||
      this.props.items !== nextProps.items
    ) {
      this.worker.postMessage({
        currentMapPosition: nextProps.currentMapPosition.toJS(),
        items: nextProps.items.toJS(),
      });
    }

    // uncomment to show a "objects are being alanyzed screen" when new items are
    // loaded into the list
    /*
    if (this.props.items !== nextProps.items) {
      this.setState({ sortedList: fromJS([]) });
    }*/
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

    this.setState({
      inSelectTimeout: true,
    });

    if (this.selectTimer) clearTimeout(this.selectTimer);
    this.selectTimer = setTimeout(() => {
      this.setState({
        inSelectTimeout: false,
      });
    }, 10000);

    dispatch(placeItemSelect(item, 'list'));
  }

  updateHeight() {
    const container = document.getElementsByClassName('ResultView');
    const upperContent = document.getElementsByClassName('upperContent');

    if (container.length > 0 && upperContent.length > 0) {
      this.setState({
        containerHeight:
          container[0].clientHeight
          - upperContent[0].clientHeight
          - 30,
      });
    }
  }

  render() {
    const { items, placeSelected, categories, hoveredElement, selectedElement } = this.props;
    const sortedItems = this.state.sortedList;

    if (!placeSelected) return null;

    this.worker.onmessage = (m) => this.setState({ sortedList: fromJS(m.data) });

    if (items.size === 0) {
      return (<div className='ResultList-EmptyInfo'>
        <FormattedMessage
          id='filter.noresults'
          description='Infotext if there are no elements matching the filter criteria.'
          defaultMessage='Kein Objekt entspricht deinen Kriteren. Versuche die Filtereinstellungen zu ändern.'
        />
      </div>);
    } else if(items.size !== 0 && sortedItems.size === 0) {
      return (<div className='ResultList-EmptyInfo'>
        <FormattedMessage
          id='filter.resultssorting'
          description='Infotext if the Elements in the List are being sorted.'
          defaultMessage='Objekte werden analysiert...'
        />
      </div>);
    }

    return (
      <div className='ResultList-ListWrapper'>
        <Infinite containerHeight={ this.state.containerHeight } elementHeight={ window.innerWidth < 770 ? 112 : 144 } className='ResultList-List'>
          { sortedItems.map((item) => {
            const category = categories.find((c) => c.get('name') === item.get('category'));
            const isHovered = hoveredElement && item.get('id') === hoveredElement.get('id');
            const isSelected = selectedElement && item.get('id') === selectedElement.get('id');
            return (<ResultListItem
              item={ item }
              category={ category }
              isHovered={ isHovered }
              isSelected={ isSelected }
              onHover={ () => this.hoverItem(item) }
              onLeave={ () => this.leaveItem() }
              onClick={ () => this.selectItem(item) }
              key={ item.get('id') }
            />);
          }) }
        </Infinite>
      </div>
    );
  }

}

export default ResultList;
