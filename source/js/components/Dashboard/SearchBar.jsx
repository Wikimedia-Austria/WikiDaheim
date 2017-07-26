import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import { autocomplete, selectPlace } from 'actions/app';

@connect(state => ({
  searchData: state.app.get('searchData'),
  searchText: state.app.get('searchText'),
}))
class SearchBar extends Component {
  static propTypes = {
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

    dispatch(selectPlace(selectedPlace));
  }

  render() {
    const {
//      searchLoading,
//      searchError,
      searchData,
      searchText,
    } = this.props;

    return (
      <section className='SearchBar'>
        <div className='SearchBar-Bar'>
          <Autocomplete
            inputProps={ { placeholder: 'Gemeinde hier suchen...' } }
            getItemValue={ (item) => item.place_name }
            items={ searchData.toJS() }
            renderItem={ (item, isHighlighted) =>
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
            }
            renderMenu={ (items) => (
              <div className='SearchBar-Suggestions' children={ items } /> // eslint-disable-line react/no-children-prop
            ) }
            value={ searchText }
            onChange={ (e) => this.onInputChange(e.target.value) }
            onSelect={ (v) => this.onPlaceSelect(v) }
          />
        </div>
      </section>
    );
  }

}

export default SearchBar;
