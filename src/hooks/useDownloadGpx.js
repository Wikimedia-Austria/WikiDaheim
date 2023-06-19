import { useCallback } from "react";
import { buildGPX, BaseBuilder } from "gpx-builder";
const { Point } = BaseBuilder.MODELS;

const doDownloadGpxFile = (filename, text) => {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/gpx+xml;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const decodeHTML = (html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const useDownloadGpx = (items) => {
  const triggerGpxDownload = useCallback(() => {
    const points = items
      .toJS()
      .filter((item) => !!item.latitude) // remove items without coordinates
      .map((item) => {
        return new Point(item.latitude, item.longitude, {
          name: item.name,
          desc: decodeHTML(item.beschreibung),
          ele: 0,
        });
      });

    const gpxData = new BaseBuilder();
    gpxData.setWayPoints(points);
    doDownloadGpxFile(`WikiDaheim_GPX.gpx`, buildGPX(gpxData.toObject()));
  }, [items]);

  return {
    triggerGpxDownload,
  };
};

export default useDownloadGpx;
