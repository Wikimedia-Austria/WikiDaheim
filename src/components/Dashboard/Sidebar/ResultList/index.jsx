import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable, { List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import { placeItemHover, placeItemLeave, placeItemSelect } from 'actions/app';
import { FormattedMessage } from 'react-intl';
import ResultListItem from './ResultListItem';
import DistanceSort from 'worker-loader!workers/distanceSort.js'; //eslint-disable-line
import { AutoSizer, List as InfiniteList } from 'react-virtualized';

class ResultList extends Component {
  static propTypes = {
    placeSelected: PropTypes.bool,
    currentMapPosition: PropTypes.object,
    hoveredElement: PropTypes.object,
    selectedElement: PropTypes.object,
    categories: PropTypes.object,
    items: PropTypes.object,
    syncListAndMap: PropTypes.bool,
    currentLanguage: PropTypes.string,
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedList: new List(),
      inSelectTimeout: false,
    };

    this.hoverItem = this.hoverItem.bind(this);
    this.leaveItem = this.leaveItem.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);

    this._list = React.createRef();
    this.worker = new DistanceSort();
  }

  componentDidMount() {
    const { items, currentMapPosition } = this.props;

    this.worker.postMessage({
      currentMapPosition: currentMapPosition.toJS(),
      items: items.toJS(),
    });

    this.worker.onmessage = (m) => this.setState({ sortedList: fromJS(m.data) });
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {

    // check if we get a new list
    if (
      (
        !this.state.inSelectTimeout && nextProps.syncListAndMap &&
        this.props.currentMapPosition !== nextProps.currentMapPosition
      ) ||
      !Immutable.is(this.props.items, nextProps.items) ||
      (!this.props.syncListAndMap && nextProps.syncListAndMap)
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

  // check if a row is selected. if so, recalculate the specific row height
  componentDidUpdate(prevProps, prevState) {
    const { _list } = this;
    const prevSelectedElement = prevProps.selectedElement;

        // we can't store this.props.selectedElement to a var as it will be undefined (why???)

        if(
          _list.current &&
          (
            (!prevSelectedElement && this.props.selectedElement) ||
            (prevSelectedElement && !this.props.selectedElement) ||
            prevSelectedElement.get('id') !== this.props.selectedElement.get('id')
          )
        ) {
          _list.current.recomputeRowHeights();
        }

        // scroll top when list reorders
        if (
          this._list.current &&
          prevState.sortedList &&
          this.state.sortedList &&
          this.state.sortedList.size > 0 &&
          prevState.sortedList.size > 0 &&
          this.state.sortedList.get(0).get('id') !== prevState.sortedList.get(0).get('id')
        ) {
          this._list.current.recomputeRowHeights();
          console.log('scrolling to 0');
          this._list.current.scrollToPosition(0);
        } else if (
          this._list.current &&
          (
            (this.props.selectedElement && !prevProps.selectedElement) ||
            (this.props.selectedElement && this.props.selectedElement.get('id') !== prevProps.selectedElement.get('id'))
          )
        ) {
          const currentIndex = this.state.sortedList.findIndex((item) => item.get('id') === this.props.selectedElement.get('id'));
          console.log('scrollingtorow');
          this._list.current.scrollToRow( currentIndex );
        }
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

    this.setState({
      inSelectTimeout: true,
    });

    if (this.selectTimer) clearTimeout(this.selectTimer);
    this.selectTimer = setTimeout(() => {
      this.setState({
        inSelectTimeout: false,
      });
    }, 5000);

    dispatch(placeItemSelect(item, 'list'));
  }


  render() {
    console.log( 'rerendering list' );
    const { items, placeSelected, categories, hoveredElement, selectedElement, currentLanguage } = this.props;
    const sortedItems = this.state.sortedList;

    if (!placeSelected) return null;

    if (items.size === 0) {
      return (<div className='ResultList-EmptyInfo'>
        <FormattedMessage
          id='filter.noresults'
          description='Infotext if there are no elements matching the filter criteria.'
          defaultMessage='Kein Objekt entspricht deinen Kriteren. Versuche die Filtereinstellungen zu ändern.'
        />
      </div>);
    } else if (
      items.size !== 0 && sortedItems.size === 0 ) {
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
        <AutoSizer>
          {({height, width}) => (
            <InfiniteList
              rowCount={sortedItems.size}
              height={ height }
              width={ width }
              rowHeight={ ({index}) => {
                const item = this.state.sortedList.get(index);
                const isSelected = selectedElement && item.get('id') === selectedElement.get('id');

                if(isSelected) return window.innerWidth < 770 ? 112 : 319;
                return window.innerWidth < 770 ? 112 : 135;
              } }
              className='ResultList-List'
              ref={this._list}
              rowRenderer={({ index, isScrolling, key, style }) => {
                const item = sortedItems.get(index);
                const category = categories.find((c) => c.get('name') === item.get('category'));
                const isHovered = hoveredElement && item.get('id') === hoveredElement.get('id');
                const isSelected = selectedElement && item.get('id') === selectedElement.get('id');
                return (
                  <ResultListItem
                    key={ key }
                    item={ item }
                    category={ category }
                    isHovered={ isHovered }
                    isSelected={ isSelected }
                    isScrolling={ isScrolling }
                    currentLanguage={ currentLanguage }
                    onHover={ () => this.hoverItem(item) }
                    onLeave={ () => this.leaveItem() }
                    onClick={ () => this.selectItem(item) }
                    style={ style }
                  />
                );
              }}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

}

export default connect(state => ({
  currentMapPosition: state.app.get('currentMapPosition'),
  hoveredElement: state.app.get('hoveredElement'),
  selectedElement: state.app.get('selectedElement'),
  categories: state.app.get('categories'),
  placeSelected: state.app.get('placeSelected'),
  syncListAndMap: state.app.get('syncListAndMap'),
  currentLanguage: state.locale.get('language'),
}))(ResultList);
