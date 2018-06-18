import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import { FormattedMessage } from 'react-intl';
import { autocomplete, selectPlace } from 'actions/app';
import FilterButton from './Filter/FilterButton';

@connect(state => ({
  placeSelected: state.app.get('placeSelected'),
  searchData: state.app.get('searchData'),
  searchText: state.app.get('searchText'),
}))
class SearchBar extends Component {
  static propTypes = {
    placeSelected: PropTypes.bool,
    searchData: PropTypes.array,
    searchText: PropTypes.string,
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.onInputChange = this.onInputChange.bind(this);
    this.onPlaceSelect = this.onPlaceSelect.bind(this);
  }

  onInputChange(text) {
    const { dispatch } = this.props;

    dispatch(autocomplete(text));
  }

  onPlaceSelect(place) {
    const { searchData, dispatch } = this.props;

    const selectedPlace = searchData.find(
      (obj) => obj.get('place_name') === place
    );

    if (selectedPlace.get('text') === 'Wien') return;

    dispatch(selectPlace(selectedPlace));
  }

  render() {
    const {
//      searchLoading,
//      searchError,
      placeSelected,
      searchData,
      searchText,
    } = this.props;

    const renderItem = (item, isHighlighted) => {
      if (item.text === 'Wien') {
        return (
          <div className='ViennaWarning'>
            <FormattedMessage
              id='search.viennaWarning'
              description='Warning to search for Viennese district.'
              defaultMessage='Bei der Suche in Wien bitte den gewünschten Bezirk angeben. (zB Ottakring)'
            />
          </div>
        );
      }
      return (
        <div className={ isHighlighted ? 'highlighted' : '' }>
          {item.text}
          {item.context.map((context) => {
            const id = context.id.split('.');
            if (['region'].includes(id[0])) {
              return `, ${ context.text }`;
            }
            return '';
          })}
        </div>
      );
    };

    return (
      <section className='SearchBar'>
        <div className='SearchBar-Bar'>
          <FormattedMessage
            id='search.placeholder'
            description='Placeholder Text for Search Bar'
            defaultMessage='Gemeinde hier suchen...'
          >
            {(placeholder) => (
              <Autocomplete
                inputProps={ { placeholder, accessKey: 'f' } }
                getItemValue={ (item) => item.place_name }
                items={ searchData.toJS() }
                renderItem={ renderItem }
                renderMenu={ (items) => (
                  <div className='SearchBar-Suggestions' children={ items } /> // eslint-disable-line react/no-children-prop
                ) }
                value={ searchText }
                onChange={ (e) => this.onInputChange(e.target.value) }
                onSelect={ (v) => this.onPlaceSelect(v) }
              />
            )}
          </FormattedMessage>
          {
            placeSelected ? <div className='SearchBar-Filter'><FilterButton /></div> : null
          }
        </div>
      </section>
    );
  }

}

export default SearchBar;
