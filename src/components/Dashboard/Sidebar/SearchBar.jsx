import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import { FormattedMessage } from 'react-intl';
import { autocomplete, selectPlace, toggleCityInfo } from 'redux/actions/app';
import { RotateSpinner } from "react-spinners-kit";
import Immutable from 'immutable';

class SearchBar extends Component {
  static propTypes = {
    searchData: PropTypes.instanceOf(Immutable.List),
    searchText: PropTypes.string,
    // from react-redux connect
    dispatch: PropTypes.func,
    isLoading: PropTypes.bool,
    placeSelected: PropTypes.bool,
  };

  constructor() {
    super();

    this.onInputChange = this.onInputChange.bind(this);
    this.onPlaceSelect = this.onPlaceSelect.bind(this);
    this.toggleCityInfo = this.toggleCityInfo.bind(this);
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

  toggleCityInfo() {
    const { dispatch } = this.props;
    dispatch(toggleCityInfo());
  }

  render() {
    const {
      isLoading,
      searchData,
      searchText,
      placeSelected,
    } = this.props;

    const renderItem = (item, isHighlighted) => {
      if (
        item.text === 'Wien'
        || item.text === 'Vienna'
      ) {
        return (
          <div className='ViennaWarning' key="viennaWarn">
            <FormattedMessage
              id='search.viennaWarning'
              description='Warning to search for Viennese district.'
              defaultMessage='Bei der Suche in Wien bitte den gewünschten Bezirk angeben. (zB Ottakring)'
            />
          </div>
        );
      }
      return (
        <div className={ isHighlighted ? 'highlighted' : '' } key={item.text}>
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
          {isLoading ? (
            <div className='SearchBar-Loader'>
              <div className='SearchBar-Loader-inner'>
                <RotateSpinner
                  color={ '#fff' }
                  loading={ true }
                />
              </div>
            </div>
          ) : null}
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
          {placeSelected ? (
            <button
              className='SearchBar-CityInfoToggle'
              onClick={ this.toggleCityInfo }
            />
          ) : null}
        </div>
      </section>
    );
  }

}

export default connect(state => ({
  searchData: state.app.get('searchData'),
  searchText: state.app.get('searchText'),
  isLoading: (
    state.app.get('categoriesLoading') ||
    state.app.get('searchLoading') ||
    state.app.get('placeLoading')
  ),
  placeSelected: state.app.get('placeSelected'),
}))(SearchBar);
