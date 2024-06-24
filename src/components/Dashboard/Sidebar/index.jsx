import React from "react";
import { useSelector } from "react-redux";
import FocusHandler from "/src/components/Global/FocusHandler";
import Page from "/src/components/Page";
import ResultList from "./ResultList";
import SearchBar from "./SearchBar";
import CityInfo from "./CityInfo";
import Filter from "./Filter";
import useDownloadGpx from "/src/hooks/useDownloadGpx";

const Sidebar = ({ items }) => {
  const placeSelected = useSelector((state) => state.app.get("placeSelected"));
  const placeLoading = useSelector((state) => state.app.get("placeLoading"));
  const { triggerGpxDownload } = useDownloadGpx(items);

  return (
    <div className="ResultList">
      <div className="upperContent">
        <SearchBar />

        {placeSelected && (
          <CityInfo onTriggerGpxDownload={() => triggerGpxDownload()} />
        )}
        {placeSelected && !placeLoading && <Filter items={items} />}
      </div>

      {placeSelected && !placeLoading && <ResultList items={items} />}
      {!placeSelected && <Page page={{ slug: "index" }} />}
      <FocusHandler view="list" />
    </div>
  );
};

export default Sidebar;
