import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Source, Popup } from 'react-mapbox-gl';
import { MAPBOX_API_KEY } from 'config/config';
import { placeItemHover, placeItemLeave, placeItemSelect, mapPositionChanged } from 'actions/app';
import mapboxgl from 'mapbox-gl';

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
  selectedElement: state.app.get('selectedElement'),
}))
class ResultMap extends Component {
  static propTypes = {
    placeMapData: PropTypes.object,
    categories: PropTypes.object,
    items: PropTypes.object,
    hoveredElement: PropTypes.object,
    selectedElement: PropTypes.object,
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    let coordinates = [13.2, 47.516231]; // Center of Austria
    let zoom = [7];

    /*
     *if a city is already selected chose its center as the map center
     * TODO: maybe deprecated due to map show on start?
     */
    if (this.props.placeMapData.get('geometry')) {
      coordinates = this.props.placeMapData.get('geometry').get('coordinates').toJS();
      zoom = 15;
    }

    this.state = {
      coordinates,
      zoom,
    };

    this.prepareMap = this.prepareMap.bind(this);
    this.componentWillUpdate = this.componentWillUpdate.bind(this);
    this.onMapMove = this.onMapMove.bind(this);
    this.updateHighlightedArea = this.updateHighlightedArea.bind(this);
  }

  componentDidMount() {
    /*
     * dispatch a map position change for the result list on map initialization
     * TODO: maybe deprecated due to map show on start?
    */
    const { dispatch, placeMapData } = this.props;
    let { coordinates } = this.state;

    if (placeMapData.get('geometry')) {
      coordinates = placeMapData.get('geometry').get('coordinates').toJS();
    }

    dispatch(mapPositionChanged(coordinates));
  }

  componentWillUpdate(nextProps) {
    /*
     * move the center of the map to the city center when a new city is selected
     */
    if (this.state.coordinates[0] === 0 || nextProps.placeMapData.get('id') !== this.props.placeMapData.get('id')) {
      // prevent the map from moving on every redux state change
      const coordinates = nextProps.placeMapData.get('geometry').get('coordinates').toJS();
      this.setState({
        coordinates,
        zoom: [15],
      });
    }

    /*
     * move the center of the map to the currently selected POI
    */
    const currentSelected = this.props.selectedElement;
    const nextSelected = nextProps.selectedElement;

    if (
      (!currentSelected && nextSelected) ||
      (currentSelected && currentSelected.get('lastChange') !== nextSelected.get('lastChange'))
    ) {
      if (parseFloat(nextSelected.get('longitude')) > 0.0) {
        const coordinates = [
          parseFloat(nextSelected.get('longitude')),
          parseFloat(nextSelected.get('latitude')),
        ];

        this.setState({
          coordinates,
          zoom: [17],
        });
      }
    }
  }

  /*
    dispatch map position events from mapbox to redux
  */
  onMapMove(map) {
    const { dispatch } = this.props;
    const mapCenter = map.getCenter();

    dispatch(mapPositionChanged([mapCenter.lng, mapCenter.lat]));
  }

  /*
  */
  prepareMap(map) {
    const { categories, dispatch } = this.props;

    map.addControl(new mapboxgl.NavigationControl());

    /* load category marker images */
    categories.forEach((category) => {
      map.loadImage(category.get('marker'), (error, image) => {
        map.addImage(category.get('name'), image);
      });
    });

    if (!window.USER_IS_TOUCHING) {
      /* trigger react */
      map.on('mouseenter', 'unclustered-point', (e) => {
        const canvas = map.getCanvas();
        canvas.style.cursor = 'pointer';

        dispatch(placeItemHover(
          this.props.items.find((c) => c.get('id') === e.features[0].properties.id)
        ));
      });

      map.on('mouseleave', 'unclustered-point', () => {
        const canvas = map.getCanvas();
        canvas.style.cursor = '';

        dispatch(placeItemLeave());
      });
    }

    map.on('click', 'unclustered-point', (e) => {
      dispatch(placeItemSelect(
        this.props.items.find((c) => c.get('id') === e.features[0].properties.id),
        'map'
      ));
    });
  }

  /*
    removes the municipality selection layer from the currently selected municipality
  */
  updateHighlightedArea(map) {
    const { placeMapData } = this.props;
    const municipalityName = placeMapData.get('text');

    if (municipalityName) {
      const pre = placeMapData.get('place_name').includes('Wien,') ? 'Wien ' : '';
      map.setFilter('municipalities', ['!=', 'name', pre + municipalityName]);
    } else {
      map.setFilter('municipalities', ['has', 'name']);
    }
  }

  render() {
    const { items, categories, hoveredElement } = this.props;

    const filteredItems = items.toJS().filter((item) => parseFloat(item.longitude) > 0.0);

    const GEO_JSON_RESULTS = {
      type: 'geojson',
      data: {
        'type': 'FeatureCollection',
        'features': filteredItems.map((item) => ({
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

    if (hoveredElement && hoveredElement.get('longitude') && hoveredElement.get('latitude')) {
      const hoveredCategory = categories.find((c) => c.get('name') === hoveredElement.get('category'));
      const address = hoveredElement.get('adresse');

      let popUpAddress = '';
      if (address) {
        popUpAddress = (
          <span>{ address }</span>
        );
      }

      popup = (
        <Popup
          coordinates={ [parseFloat(hoveredElement.get('longitude')), parseFloat(hoveredElement.get('latitude'))] }
          style={ {
            'backgroundColor': hoveredCategory.get('color'),
          } }
          offset={
            [0, -35]
           }
        >
          <strong>{hoveredElement.get('name')}</strong>
          {popUpAddress}
        </Popup>
      );
    }

    return (<div className='ResultMap'>
      <Map
        style='mapbox://styles/wikimediaaustria/cji05myuu486p2slazs7ljpyw' // eslint-disable-line react/style-prop-object
        containerStyle={ {
          height: '100%',
          width: '100%',
        } }
        center={ this.state.coordinates }
        onStyleLoad={ this.prepareMap }
        onMoveEnd={ this.onMapMove }
        onMoveStart={ this.updateHighlightedArea }
        zoom={ this.state.zoom }
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
                    [30, '#373974'],
                    [70, '#23224E'],
              ],
            },
            'circle-radius': {
              property: 'point_count',
              type: 'interval',
              stops: [
                    [0, 20],
                    [30, 30],
                    [70, 40],
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
            'icon-allow-overlap': true,
          } }
        />
        {popup}
      </Map></div>
    );
  }

}

export default ResultMap;
