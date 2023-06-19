import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import { toggleCityInfo } from "redux/actions/app";
import Settings from "../Settings";
import ExternalLinkOverlay from "./ExternalLinkOverlay";

const CityInfo = ({ onTriggerGpxDownload }) => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.app.get("articles"));
  const placeMapData = useSelector((state) => state.app.get("placeMapData"));
  const showCityInfo = useSelector((state) => state.app.get("showCityInfo"));
  const commonscat = useSelector((state) => state.app.get("commonscat"));

  const [activeLink, setActiveLink] = useState(null);

  const classnames = classNames("CityInfo", {
    "CityInfo--active": showCityInfo,
  });

  const cityName = useMemo(() => placeMapData.get("text"), [placeMapData]);
  const currentArticle = useMemo(() => articles.get(0), [articles]);

  /* get Wiki Edit Links */
  /*
  const missingSections = useMemo(
    () =>
      !currentArticle
        ? ""
        : currentArticle
            .get("sections")
            .filter((section) => !section.get("inArticle"))
            .map(
              (section) =>
                `<a
        href="${section.get("editLink")}"
        key="${section.get("name")}"
      >
        ${section.get("name")}
      </a>`
            )
            .join(", "),
    [currentArticle]
  );
  */

  if (!currentArticle) return null;

  return (
    <>
      <section className={classnames}>
        <button
          className="CityInfo-Closer"
          onClick={() => dispatch(toggleCityInfo())}
        />
        <div className="CityInfo-Wrapper">
          <div className="CityInfo-Content">
            <a
              href={`https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=WikiDaheim-at&categories=${commonscat}&descriptionlang=de`}
              target="_blank"
              rel="noopener noreferrer"
              className="CityInfo-Link"
            >
              <FormattedMessage
                id="uploadPhoto"
                description="Text for Photo Upload-Button"
                defaultMessage="Foto hochladen"
              >
                {(text) => <strong>{text}</strong>}
              </FormattedMessage>

              <span>
                <FormattedMessage
                  id="uploadPhoto.description"
                  description="Description text for Photo Upload Button"
                  defaultMessage="Lade ein Foto zu {cityName} hoch"
                  values={{ cityName }}
                />
              </span>
            </a>
            <a
              href={currentArticle.get("editLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="CityInfo-Link CityInfo-Link-Wiki"
            >
              <FormattedMessage
                id="cityinfo.editWikiLink"
                description="Text edit Wiki button"
                defaultMessage="Wikipedia-Artikel bearbeiten"
              >
                {(text) => <strong>{text}</strong>}
              </FormattedMessage>
              {/*
              <span>
                <FormattedMessage
                  id="cityinfo.editWikiLinkDescription"
                  description='Description text for the "Edit Wiki"-Link'
                  defaultMessage="Fehlende Abschnitte: {missingSectionsCount, plural,
                        =0 {keine}
                        other {}
                    }"
                  values={{
                    missingSectionsCount: missingSections.length,
                    missingSections: "",
                  }}
                />
                {missingSections.length > 0 ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: missingSections }} // eslint-disable-line
                  />
                ) : null}
              </span>
                */}
            </a>
          </div>
          <footer className="CityInfo-Footer">
            <button
              className="CityInfo-Link"
              onClick={() => setActiveLink("regio")}
            >
              <FormattedMessage
                id="cityinfo.regiowikiTitle"
                description="Title for RegioWiki"
                defaultMessage="RegioWiki"
              />
            </button>

            <button
              className="CityInfo-Link"
              onClick={() => setActiveLink("gpx")}
            >
              <FormattedMessage
                id="cityinfo.gpxTitle"
                description="Title for GPX-Download"
                defaultMessage="GPX-Datei"
              />
            </button>

            <Settings />
          </footer>
        </div>
      </section>

      {activeLink === "regio" && (
        <ExternalLinkOverlay
          titleId="cityinfo.regiowikiTitle"
          textId="cityinfo.regiowikiText"
          link={`https://regiowiki.at/wiki/${currentArticle.get("source")}`}
          closeAction={() => setActiveLink(null)}
        />
      )}

      {activeLink === "gpx" && (
        <ExternalLinkOverlay
          titleId="cityinfo.gpxTitle"
          textId="cityinfo.gpxText"
          onClick={() => onTriggerGpxDownload()}
          closeAction={() => setActiveLink(null)}
        />
      )}
    </>
  );
};

export default CityInfo;
