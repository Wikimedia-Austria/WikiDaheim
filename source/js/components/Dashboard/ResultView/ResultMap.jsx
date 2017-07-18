import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { MAPBOX_API_KEY } from 'config/config';

const Map = ReactMapboxGl({
  accessToken: MAPBOX_API_KEY,
});

@connect(state => ({
  placeMapData: state.app.get('placeMapData'),
}))
class ResultMap extends Component {


  static propTypes = {
    placeMapData: PropTypes.object,
    items: PropTypes.object,
  };

  render() {
    const { placeMapData, items } = this.props;
    const coordinates = placeMapData.get('geometry').get('coordinates');

    return (<div>
      <Map
        style='mapbox://styles/wikimediaaustria/cj4yaqh5g4w9s2rqsjbqb1bqk' // eslint-disable-line react/style-prop-object
        containerStyle={ {
          height: '60vh',
          width: '100vw',
        } }
        center={ coordinates.toJS() }
      >
        <Layer
          type='symbol'
          id='marker'
          layout={ { 'icon-image': 'marker-15' } }
        >
          {items.toJS().map((item) =>
            <Feature
              coordinates={ [parseFloat(item.longitude), parseFloat(item.latitude)] }
              key={ item.editLink }
            />
          )}
        </Layer>
      </Map></div>
    );
  }

}

export default ResultMap;
