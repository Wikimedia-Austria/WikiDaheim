import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import Truncate from "react-truncate";
import ReactMapboxGl, { Layer, Source, Popup } from "react-mapbox-gl";
import { MAPBOX_API_KEY } from "/src/config";
import boundaries from "/src/config/boundaries_mapped.json";
import {
  placeItemHover,
  placeItemLeave,
  placeItemSelect,
  mapPositionChanged,
  mapZoomChanged,
  municipalityHover,
  municipalityLeave,
  selectPlace,
  placeSelectClear,
  mapLoaded,
} from "/src/redux/actions/app";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker?worker";
import { FormattedMessage } from "react-intl";
import CategoryName from "/src/components/Global/CategoryName";
import FocusHandler from "/src/components/Global/FocusHandler";
import getFilePath from "wikimedia-commons-file-path";
import Immutable from "immutable";

mapboxgl.workerClass = MapboxWorker;
const Map = ReactMapboxGl({
  accessToken: MAPBOX_API_KEY,
});

class ResultMap extends Component {
  static propTypes = {
    placeMapData: PropTypes.object,
    currentMapPosition: PropTypes.instanceOf(Immutable.List),
    currentMapZoom: PropTypes.number,
    categories: PropTypes.object,
    items: PropTypes.object,
    hoveredElement: PropTypes.object,
    hoveredMunicipality: PropTypes.object,
    selectedElement: PropTypes.object,
    placeSelected: PropTypes.bool,
    placeLoading: PropTypes.bool,
    enableClustering: PropTypes.bool,
    campaign: PropTypes.string,

    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    let coordinates = [13.2, 47.516231]; // Center of Austria
    let zoom = [7];

    /*
     * If we are in the Burgenland Campaign set the default zoom to burgenland
     */
    if ("burgenland" === "props.campaign") {
      coordinates = [16.416665, 47.499998]; // Center of Burgenland
      zoom = [8];
    }

    /*
     *if a city is already selected chose its center as the map center
     * TODO: maybe deprecated due to map show on start?
     */

    if (this.props.currentMapPosition) {
      coordinates = this.props.currentMapPosition.toJS();
      zoom = [this.props.currentMapZoom];
    }

    this.state = {
      coordinates,
      zoom,
    };

    this.prepareMap = this.prepareMap.bind(this);
    this.loadMissingMapImage = this.loadMissingMapImage.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.onMapMove = this.onMapMove.bind(this);
    this.updateHighlightedArea = this.updateHighlightedArea.bind(this);
    this.updateMapPadding = this.updateMapPadding.bind(this);
    this.triggerMunicipalityHover = this.triggerMunicipalityHover.bind(this);
    this.triggerMunicipalityLeave = this.triggerMunicipalityLeave.bind(this);
    this.triggerMunicipalitySelect = this.triggerMunicipalitySelect.bind(this);
  }

  componentDidMount() {
    /*
     * dispatch a map position change for the result list on map initialization
     * TODO: maybe deprecated due to map show on start?
     */
    const { dispatch, placeMapData } = this.props;
    let { coordinates } = this.state;

    if (placeMapData.get("geometry")) {
      coordinates = placeMapData.get("geometry").get("coordinates").toJS();
    }

    dispatch(mapPositionChanged(coordinates));
  }

  componentDidUpdate(prevProps, prevState) {
    /*
     * move the center of the map to the city center when a new city is selected
     */
    const {
      placeLoading,
      placeMapData,
      selectedElement,
      placeSelected,
      campaign,
    } = this.props;
    if (
      (prevState.coordinates[0] === 0 ||
        (!placeLoading && prevProps.placeLoading)) &&
      placeMapData.get("geometry")
    ) {
      // prevent the map from moving on every redux state change
      const coordinates = placeMapData
        .get("geometry")
        .get("coordinates")
        .toJS();
      this.setState({
        coordinates,
        zoom: [12],
      });
    }

    /*
     * move the center of the map to the currently selected POI
     */
    const currentSelected = prevProps.selectedElement;
    const nextSelected = selectedElement;

    if (
      (!currentSelected && nextSelected) ||
      (currentSelected &&
        currentSelected.get("lastChange") !== nextSelected.get("lastChange"))
    ) {
      if (parseFloat(nextSelected.get("longitude")) > 0.0) {
        const coordinates = [
          parseFloat(nextSelected.get("longitude")),
          parseFloat(nextSelected.get("latitude")),
        ];

        this.setState({
          coordinates,
          zoom: [17],
        });
      }
    }

    /*
      re-adjust the map center after adding the sidebar shift
    */
    if (!prevProps.placeSelected && placeSelected) {
      setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    }

    /*
     * When switching to a Campaign View adjust the Map
     */
    const { dispatch } = this.props;

    if (!prevProps.campaign && campaign && campaign === "burgenland") {
      // zoom to bugenland
      this.setState({
        coordinates: [16.416665, 47.499998],
        zoom: [8],
      });

      dispatch(placeSelectClear());

      // trigger resize event to update map
      setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    } else if (prevProps.campaign && !campaign) {
      // zoom to austria
      this.setState({
        coordinates: [13.2, 47.516231],
        zoom: [7],
      });

      dispatch(placeSelectClear());

      // trigger resize event to update map
      setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    }
  }

  /*
    dispatch map position events from mapbox to redux
  */
  onMapMove(map) {
    const { dispatch, currentMapZoom } = this.props;
    const mapCenter = map.getCenter();

    dispatch(mapPositionChanged([mapCenter.lng, mapCenter.lat]));

    if (map.getZoom() !== currentMapZoom) {
      dispatch(mapZoomChanged(map.getZoom()));
    }
  }

  /*
    sets mapbox.js options and registers event listeners for the map
  */
  prepareMap(map) {
    const { dispatch } = this.props;

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.GeolocateControl());

    //disable drag rotate and touch rotate
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    if (!window.USER_IS_TOUCHING) {
      /*
        trigger Pin hover
      */

      const unclusteredMouseMove = (e) => {
        const { hoveredElement } = this.props;

        // only trigger if we move over a new pin
        if (
          hoveredElement &&
          hoveredElement.get("id") === e.features[0].properties.id
        )
          return;

        const canvas = map.getCanvas();
        canvas.style.cursor = "pointer";

        dispatch(
          placeItemHover(
            this.props.items.find(
              (c) => c.get("id") === e.features[0].properties.id
            )
          )
        );
      };

      const unclusteredMouseLeave = () => {
        const canvas = map.getCanvas();
        canvas.style.cursor = "";

        dispatch(placeItemLeave());
      };

      map.on("mousemove", "unclustered-point", (e) => {
        unclusteredMouseMove(e);
      });

      map.on("mouseleave", "unclustered-point", () => {
        unclusteredMouseLeave();
      });

      map.on("mousemove", "unclustered-point-uncluster", (e) => {
        unclusteredMouseMove(e);
      });

      map.on("mouseleave", "unclustered-point-uncluster", () => {
        unclusteredMouseLeave();
      });

      /*
      trigger municipality hover (small zoom size layer)
      */
      map.on("mousemove", "wd-municipalities", (e) =>
        this.triggerMunicipalityHover(e, map)
      );
      map.on("mouseleave", "wd-municipalities", (e) =>
        this.triggerMunicipalityLeave(e, map)
      );
    }

    const unclusteredClick = (e) => {
      dispatch(
        placeItemSelect(
          this.props.items.find(
            (c) => c.get("id") === e.features[0].properties.id
          ),
          "map"
        )
      );

      //e.stopPropagation();
    };

    map.on("click", "unclustered-point", (e) => {
      unclusteredClick(e);
    });
    map.on("click", "unclustered-point-uncluster", (e) => {
      unclusteredClick(e);
    });

    map.on("click", "wd-municipalities", (e) =>
      this.triggerMunicipalitySelect(e)
    );

    this.updateHighlightedArea(map);
    this.updateMapPadding(map);

    dispatch(mapLoaded());
  }

  loadMissingMapImage(map, e) {
    const { categories } = this.props;
    const missingImage = e.id;

    // add an empty placeholder to prevent mapbox from complaining about the missing image until the image is loaded
    map.addImage(missingImage, {
      width: 38,
      height: 52,
      data: new Uint8Array(38 * 52 * 4),
    });

    /* load category marker image */
    const filteredCategories = categories.filter(
      (category) => missingImage === category.get("name")
    );

    if (filteredCategories.size > 0) {
      const category = filteredCategories.get(0);
      map.loadImage(category.get("marker"), (error, image) => {
        map.updateImage(missingImage, image);
      });
    }
  }

  triggerMunicipalityHover(e, map) {
    const { dispatch, hoveredMunicipality } = this.props;
    const { lngLat, features } = e;
    const feature = features[0];
    const { id } = feature;

    // check if we are already hovering over this place
    if (hoveredMunicipality && hoveredMunicipality.get("iso") === id) return;

    // look up info about the municipality
    const municipality = boundaries.find((e) => e.feature_id === id);

    // clear the micro-timeout
    if (this.municipalityHoverTimer) clearTimeout(this.municipalityHoverTimer);

    /*
      the hover action is packed into a small timeout to reduce
      event calls when moving over a large area
    */

    this.municipalityHoverTimer = setTimeout(() => {
      const canvas = map.getCanvas();
      canvas.style.cursor = "pointer";

      dispatch(
        municipalityHover({
          iso: id,
          name: municipality.name,
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        })
      );

      setTimeout(() => this.updateHighlightedArea(map), 10);
    }, 20);
  }

  triggerMunicipalityLeave(e, map) {
    const { dispatch } = this.props;
    const canvas = map.getCanvas();

    if (this.municipalityHoverTimer) clearTimeout(this.municipalityHoverTimer);
    canvas.style.cursor = "";

    dispatch(municipalityLeave());
  }

  triggerMunicipalitySelect(e) {
    const { dispatch, hoveredElement } = this.props;
    const { id } = e.features[0];

    if (hoveredElement) return;

    // look up info about the municipality
    const municipality = boundaries.find((e) => e.feature_id === id);

    dispatch(municipalityLeave());
    dispatch(
      selectPlace(
        fromJS({
          id,
          iso: municipality.unit_code,
          text: municipality.name,
          geometry: {
            coordinates: municipality.centroid,
          },
        })
      )
    );
  }

  /*
    removes the municipality selection layer from the currently selected municipality,
    adds hover effect to other municipailties
  */
  updateHighlightedArea(map) {
    if (!map._loaded) return;

    const { placeMapData, placeLoading } = this.props;
    const municipalityId = placeMapData.get("iso");
    const { hoveredMunicipality } = this.props;

    // filter current municipality
    if (municipalityId && !placeLoading) {
      // look up info about the municipality
      const isoCodes = boundaries
        .filter((e) => e.unit_code === municipalityId)
        .map((b) => ["!=", "$id", b.feature_id]);

      if (isoCodes.length > 0) {
        map.setFilter("wd-municipalities", [
          "all",
          ["==", "iso_3166_1", "AT"],
          ...isoCodes,
        ]);
      }
    } else {
      map.setFilter("wd-municipalities", ["all", ["==", "iso_3166_1", "AT"]]);
    }

    // hover-effect for municipalities
    if (map.getSource("municipality-hover-item")) {
      if (hoveredMunicipality) {
        const features = map.querySourceFeatures("composite", {
          sourceLayer: "boundaries_admin_3",
          filter: ["==", "$id", hoveredMunicipality.get("iso")],
        });

        map
          .getSource("municipality-hover-item")
          .setData({ type: "FeatureCollection", features });
      } else {
        map
          .getSource("municipality-hover-item")
          .setData({ type: "FeatureCollection", features: [] });
      }
    }
  }

  // Updates the Map offset to fit the sidebar
  async updateMapPadding(map) {
    const { placeSelected } = this.props;

    // when we are currently zooming await the end of it as otherwise zooming will be aborted
    const sleep = (m) => new Promise((r) => setTimeout(r, m));
    while (map._zooming) {
      await sleep(200);
    }

    if (placeSelected && window.innerWidth > 768) {
      map.setPadding({
        left: window.innerWidth / 3,
      });
    }

    this.updateHighlightedArea(map);
  }

  /*
    render the map
  */
  render() {
    const {
      items,
      categories,
      hoveredElement,
      hoveredMunicipality,
      enableClustering,
    } = this.props;

    const filteredItems = items
      .toJS()
      .filter((item) => parseFloat(item.longitude) > 0.0);

    const GEO_JSON_RESULTS = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: filteredItems.map((item) => ({
          type: "Feature",
          properties: {
            id: item.id,
            category: item.category,
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(item.longitude),
              parseFloat(item.latitude),
            ],
          },
        })),
      },
      cluster: false,
      clusterMaxZoom: 2, // Max zoom to cluster points on
    };

    const GEO_JSON_RESULTS_CLUSTERED = {
      ...GEO_JSON_RESULTS,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    };

    // show the mouse-hover-popup
    let popup = null;

    if (hoveredMunicipality) {
      popup = (
        <Popup
          coordinates={[
            parseFloat(hoveredMunicipality.get("longitude")),
            parseFloat(hoveredMunicipality.get("latitude")),
          ]}
          offset={[0, -15]}
          style={{
            backgroundColor: "black",
          }}
        >
          <FormattedMessage
            id="map.switchMunicipality"
            description="Title for the Switch Municipality Popup"
            defaultMessage="zu Gebiet wechseln"
          />
          <strong>{hoveredMunicipality.get("name")}</strong>
        </Popup>
      );
    }

    if (
      window.innerWidth > 669 &&
      hoveredElement &&
      hoveredElement.get("longitude") &&
      hoveredElement.get("latitude")
    ) {
      const hoveredCategory = categories.find(
        (c) => c.get("name") === hoveredElement.get("category")
      );
      const address = hoveredElement.get("adresse");
      let hasPhoto = false;
      const descriptionText = hoveredElement.get("beschreibung");
      let hasText = false;

      let popUpAddress = "";
      if (address) {
        popUpAddress = <span>, {address}</span>;
      }

      const photoContainerStyle = {};
      if (
        hoveredElement.get("foto") &&
        !hoveredElement
          .get("foto")
          .match(/\.(webm|wav|mid|midi|kar|flac|ogx|ogg|ogm|ogv|oga|spx|opus)/)
      ) {
        hasPhoto = true;
        const url = getFilePath(hoveredElement.get("foto"), 256);
        photoContainerStyle.backgroundImage = `url('${url}')`;
      } else if (descriptionText && descriptionText.length > 0) {
        hasText = true;
      }

      popup = (
        <Popup
          coordinates={[
            parseFloat(hoveredElement.get("longitude")),
            parseFloat(hoveredElement.get("latitude")),
          ]}
          style={{
            backgroundColor: hoveredCategory.get("color"),
            borderColor: hoveredCategory.get("color"),
          }}
          offset={{
            top: [0, 20],
            bottom: [0, -30],
          }}
        >
          {hasPhoto ? (
            <div className="PhotoContainer" style={photoContainerStyle} />
          ) : null}

          {hasText ? (
            <div className="TextContainer">
              <div>
                <Truncate lines={4}>
                  <p
                    dangerouslySetInnerHTML={{ __html: descriptionText }} // eslint-disable-line
                  />
                </Truncate>
              </div>
            </div>
          ) : null}

          <div className="DescriptionContainer">
            <strong>{hoveredElement.get("name")}</strong>
            {hoveredElement.get("categories") &&
              hoveredElement
                .get("categories")
                .map((c) => <CategoryName category={c} key={c} />)}
            {popUpAddress}
          </div>
        </Popup>
      );
    }

    return (
      <div className="ResultMap">
        <div className="ResultMap-Wrapper">
          <Map
            style="mapbox://styles/wikimediaaustria/ckceqt44w0u9s1inyj4e2bort" // eslint-disable-line react/style-prop-object
            containerStyle={{
              height: "100%",
              width: "100%",
            }}
            center={this.state.coordinates}
            onStyleLoad={this.prepareMap}
            onMoveEnd={this.onMapMove}
            onMoveStart={this.updateHighlightedArea}
            onStyleImageMissing={this.loadMissingMapImage}
            zoom={this.state.zoom}
            onResize={this.updateMapPadding}
          >
            <Source
              id="municipality-hover-item"
              geoJsonSource={{
                type: "geojson",
                data: { type: "FeatureCollection", features: [] },
              }}
            />

            <Source id="items" geoJsonSource={GEO_JSON_RESULTS_CLUSTERED} />
            <Source id="items-unclustered" geoJsonSource={GEO_JSON_RESULTS} />

            {!enableClustering && (
              <>
                <Layer
                  id="unclustered-point-uncluster"
                  type="symbol"
                  sourceId="items-unclustered"
                  layerOptions={{
                    filter: ["!has", "point_count"],
                  }}
                  layout={{
                    "icon-image": {
                      property: "category",
                      type: "categorical",
                      stops: categories
                        .toJS()
                        .map((cat) => [cat.name, cat.name]),
                    },
                    "icon-size": 0.5,
                    "icon-offset": [0, -10],
                    "icon-allow-overlap": true,
                  }}
                />
              </>
            )}

            {!!enableClustering && (
              <>
                <Layer
                  id="clusters"
                  sourceId="items"
                  type="circle"
                  paint={{
                    "circle-color": {
                      property: "point_count",
                      type: "interval",
                      stops: [
                        [0, "#57599A"],
                        [30, "#373974"],
                        [70, "#23224E"],
                      ],
                    },
                    "circle-radius": {
                      property: "point_count",
                      type: "interval",
                      stops: [
                        [0, 20],
                        [30, 30],
                        [70, 40],
                      ],
                    },
                  }}
                  layerOptions={{
                    filter: ["has", "point_count"],
                  }}
                />

                <Layer
                  id="cluster-count"
                  type="symbol"
                  sourceId="items"
                  layerOptions={{
                    filter: ["has", "point_count"],
                  }}
                  layout={{
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["Space Mono Bold", "Arial Unicode MS Bold"],
                    "text-size": 12,
                  }}
                  paint={{
                    "text-color": "#FFFFFF",
                  }}
                />

                <Layer
                  id="unclustered-point"
                  type="symbol"
                  sourceId={"items"}
                  layerOptions={{
                    filter: ["!has", "point_count"],
                  }}
                  layout={{
                    "icon-image": {
                      property: "category",
                      type: "categorical",
                      stops: categories
                        .toJS()
                        .map((cat) => [cat.name, cat.name]),
                    },
                    "icon-size": 0.5,
                    "icon-offset": [0, -10],
                    "icon-allow-overlap": true,
                  }}
                />
              </>
            )}

            <Layer
              id="municipality-hover"
              type="fill"
              sourceId="municipality-hover-item"
              paint={{
                "fill-color": "#000",
                "fill-opacity": 0.08,
                "fill-antialias": true,
              }}
            />
            {popup}
          </Map>
        </div>
        <FocusHandler view="map" />
      </div>
    );
  }
}

export default connect((state) => ({
  placeMapData: state.app.get("placeMapData"),
  currentMapPosition: state.app.get("currentMapPosition"),
  currentMapZoom: state.app.get("currentMapZoom"),
  categories: state.app.get("categories"),
  hoveredElement: state.app.get("hoveredElement"),
  hoveredMunicipality: state.app.get("hoveredMunicipality"),
  selectedElement: state.app.get("selectedElement"),
  placeSelected: state.app.get("placeSelected"),
  placeLoading: state.app.get("placeLoading"),
  enableClustering: state.app.get("enableClustering"),
}))(ResultMap);
