import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Source, Popup } from 'react-mapbox-gl';
import { MAPBOX_API_KEY } from 'config/config';
import { placeItemHover, placeItemLeave } from 'actions/app';

/*
  possible enhancements: show city borders from
  https://raw.githubusercontent.com/ginseng666/GeoJSON-TopoJSON-Austria/master/2017/simplified-99.9/gemeinden_999_geo.json
*/


const Map = ReactMapboxGl({
  accessToken: MAPBOX_API_KEY,
});

@connect(state => ({
  placeMapData: state.app.get('placeMapData'),
  categories: state.app.get('categories'),
  hoveredElement: state.app.get('hoveredElement'),
}))
class ResultMap extends Component {
  static propTypes = {
    placeMapData: PropTypes.object,
    categories: PropTypes.object,
    items: PropTypes.object,
    hoveredElement: PropTypes.object,
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.prepareMap = this.prepareMap.bind(this);
    this.componentWillUpdate = this.componentWillUpdate.bind(this);

    this.state = {
      coordinates: this.props.placeMapData.get('geometry').get('coordinates').toJS(),
    };
  }

  componentWillUpdate(nextProps) {
    // prevent the map from moving on every redux state change
    if (this.state.coordinates[0] === 0 || nextProps.placeMapData.get('id') !== this.props.placeMapData.get('id')) {
      const coordinates = nextProps.placeMapData.get('geometry').get('coordinates').toJS();
      this.setState({ coordinates });
    }
  }

  prepareMap(map) {
    const { categories, items, dispatch } = this.props;

    /* load category marker images */
    categories.forEach((category) => {
      map.loadImage(category.get('markerImage'), (error, image) => {
        if (error) throw error;
        map.addImage(category.get('name'), image);
      });
    });

    /* trigger react */
    map.on('mouseenter', 'unclustered-point', (e) => {
      const canvas = map.getCanvas();
      canvas.style.cursor = 'pointer';

      dispatch(placeItemHover(
        items.find((c) => c.get('id') === e.features[0].properties.id)
      ));
    });

    map.on('mouseleave', 'unclustered-point', () => {
      const canvas = map.getCanvas();
      canvas.style.cursor = '';

      dispatch(placeItemLeave());
    });
  }

  render() {
    const { items, categories, hoveredElement } = this.props;

    const GEO_JSON_RESULTS = {
      type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: {
        'type': 'FeatureCollection',
        'features': items.toJS().map((item) => ({
          'type': 'Feature',
          'properties': {
            'id': item.id,
            'category': item.category,
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [parseFloat(item.longitude), parseFloat(item.latitude)],
          },
        })
      ),
      },
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    };

    // show the mouse-hover-popup
    let popup = null;

    if (hoveredElement) {
      const hoveredCategory = categories.find((c) => c.get('name') === hoveredElement.get('category'));
      popup = (
        <Popup
          coordinates={ [parseFloat(hoveredElement.get('longitude')), parseFloat(hoveredElement.get('latitude'))] }
          style={ {
            'backgroundColor': hoveredCategory.get('color'),
          } }
          offset={
            [0, -30]
           }
        >
          <strong>{hoveredElement.get('name')}</strong>
        </Popup>
      );
    }

    return (<div>
      <Map
        style='mapbox://styles/wikimediaaustria/cj4yaqh5g4w9s2rqsjbqb1bqk' // eslint-disable-line react/style-prop-object
        containerStyle={ {
          height: '60vh',
          width: '100vw',
        } }
        center={ this.state.coordinates }
        onStyleLoad={ this.prepareMap }
      >
        <Source id='items' geoJsonSource={ GEO_JSON_RESULTS } />
        <Layer
          id='clusters'
          sourceId='items'
          type='circle'
          paint={ {
            'circle-color': {
              property: 'point_count',
              type: 'interval',
              stops: [
                    [0, '#57599A'],
                    [100, '#373974'],
                    [750, '#23224E'],
              ],
            },
            'circle-radius': {
              property: 'point_count',
              type: 'interval',
              stops: [
                    [0, 20],
                    [100, 30],
                    [750, 40],
              ],
            },
          } }
          layerOptions={ {
            filter: ['has', 'point_count'],
          } }
        />

        <Layer
          id='cluster-count'
          type='symbol'
          sourceId='items'
          layerOptions={ {
            filter: ['has', 'point_count'],
          } }
          layout={ {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Space Mono Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
          } }
          paint={ {
            'text-color': '#FFFFFF',
          } }
        />

        <Layer
          id='unclustered-point'
          type='symbol'
          sourceId='items'
          layerOptions={ {
            filter: ['!has', 'point_count'],
          } }
          layout={ {
            'icon-image': {
              property: 'category',
              type: 'categorical',
              stops: categories.toJS().map((cat) => [cat.name, cat.name]),
            },
            'icon-size': 0.5,
          } }
        />
        {popup}
      </Map></div>
    );
  }

}

export default ResultMap;
