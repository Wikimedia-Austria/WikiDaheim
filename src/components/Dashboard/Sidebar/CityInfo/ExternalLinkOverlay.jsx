import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

const ExternalLinkOverlay = ({
  titleId,
  textId,
  link,
  onClick,
  closeAction,
}) => {
  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="ExternalLink-Overlay"
      onClick={closeAction}
    >
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className="ExternalLink-Overlay-Inner"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="ExternalLink-Close" onClick={closeAction}>
          <FormattedMessage
            id="cancel"
            description="Text for Cancel-Buttons"
            defaultMessage="Abbrechen"
          />
        </button>
        <h1>
          <FormattedMessage id={titleId} />
        </h1>
        <p>
          <FormattedMessage id={textId} />
        </p>
        <a
          href={link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
            closeAction();
          }}
        >
          <FormattedMessage
            id="cityinfo.openLink"
            description="Text for External Link-Buttons (from City Details View)"
            defaultMessage="Seite öffnen"
          />
        </a>
      </div>
    </div>
  );
};

ExternalLinkOverlay.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  link: PropTypes.string,
  closeAction: PropTypes.func,
};

export default ExternalLinkOverlay;
