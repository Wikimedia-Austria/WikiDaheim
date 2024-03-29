import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import PropertyFilterItem from "./PropertyFilterItem";

class PropertyFilter extends Component {
  render() {
    return (
      <div className="PropertyFilter">
        <FormattedMessage
          id="filter.missingImages"
          description="Title of the Missing Images-Filter"
          defaultMessage="Fehlende Bilder"
        >
          {(title) => (
            <PropertyFilterItem title={title[0]} id="missing_images" />
          )}
        </FormattedMessage>

        <FormattedMessage
          id="filter.missingDescription"
          description="Title of the Missing Description-Filter"
          defaultMessage="Fehlende Beschreibung"
        >
          {(title) => (
            <PropertyFilterItem title={title[0]} id="missing_description" />
          )}
        </FormattedMessage>
      </div>
    );
  }
}

export default PropertyFilter;
