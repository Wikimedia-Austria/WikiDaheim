import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "react-autocomplete";
import { FormattedMessage } from "react-intl";
import {
  autocomplete,
  selectPlace,
  toggleCityInfo,
} from "/src/redux/actions/app";
import { RotateSpinner } from "react-spinners-kit";

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.app.get("searchData"));
  const searchText = useSelector((state) => state.app.get("searchText"));
  const placeSelected = useSelector((state) => state.app.get("placeSelected"));
  const categoriesLoading = useSelector((state) =>
    state.app.get("categoriesLoading")
  );
  const searchLoading = useSelector((state) => state.app.get("searchLoading"));
  const placeLoading = useSelector((state) => state.app.get("placeLoading"));
  const mapLoaded = useSelector((state) => state.app.get("mapLoaded"));

  const isLoading =
    categoriesLoading || searchLoading || placeLoading || !mapLoaded;

  console.log("LoadingStates", {
    categoriesLoading,
    searchLoading,
    placeLoading,
    mapLoaded,
  });

  const onPlaceSelect = (place) => {
    const selectedPlace = searchData.find((p) => p.get("place_name") === place);
    dispatch(selectPlace(selectedPlace));
  };

  const renderItem = (item, isHighlighted) => (
    <div className={isHighlighted ? "highlighted" : ""} key={item.text}>
      {item.text}
      {item.context.map((context) => {
        const id = context.id.split(".");
        if (["region"].includes(id[0])) {
          return `, ${context.text}`;
        }
        return "";
      })}
    </div>
  );

  return (
    <section className="SearchBar">
      <div className="SearchBar-Bar">
        {isLoading ? (
          <div className="SearchBar-Loader">
            <div className="SearchBar-Loader-inner">
              <RotateSpinner color={"#fff"} loading={true} />
            </div>
          </div>
        ) : null}
        <FormattedMessage
          id="search.placeholder"
          description="Placeholder Text for Search Bar"
          defaultMessage="Gemeinde hier suchen..."
        >
          {(placeholder) => (
            <Autocomplete
              inputProps={{ placeholder, accessKey: "f" }}
              getItemValue={(item) => item.place_name}
              items={searchData.toJS()}
              renderItem={renderItem}
              renderMenu={(items) => (
                <div className="SearchBar-Suggestions" children={items} /> // eslint-disable-line react/no-children-prop
              )}
              value={searchText}
              onChange={(e) => dispatch(autocomplete(e.target.value))}
              onSelect={(v) => onPlaceSelect(v)}
            />
          )}
        </FormattedMessage>
        {placeSelected ? (
          <button
            className="SearchBar-CityInfoToggle"
            onClick={() => dispatch(toggleCityInfo())}
          />
        ) : null}
      </div>
    </section>
  );
};

export default SearchBar;
