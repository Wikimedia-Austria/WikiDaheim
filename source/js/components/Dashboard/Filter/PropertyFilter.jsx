import React, { Component } from 'react';
import PropertyFilterItem from './PropertyFilterItem';
import { FormattedMessage } from 'react-intl';

class PropertyFilter extends Component {

  render() {
    return (
      <div className='PropertyFilter'>
        <FormattedMessage
          id='filter.incomplete'
          description='Title of the Incomplete Objects-Filter'
          defaultMessage='Unvollständige Objekte'
        >
          {(title) => (
            <PropertyFilterItem
              title={ title }
              id='incomplete'
            />
          )}
        </FormattedMessage>

        <FormattedMessage
          id='filter.missingImages'
          description='Title of the Missing Images-Filter'
          defaultMessage='Fehlende Bilder'
        >
          {(title) => (
            <PropertyFilterItem
              title={ title }
              id='missing_images'
            />
          )}
        </FormattedMessage>

        <FormattedMessage
          id='filter.missingDescription'
          description='Title of the Missing Description-Filter'
          defaultMessage='Fehlende Beschreibung'
        >
          {(title) => (
            <PropertyFilterItem
              title={ title }
              id='missing_description'
            />
          )}
        </FormattedMessage>
      </div>
    );
  }

}

export default PropertyFilter;
