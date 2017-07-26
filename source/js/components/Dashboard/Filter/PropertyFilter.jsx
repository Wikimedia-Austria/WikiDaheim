import React, { Component } from 'react';
import PropertyFilterItem from './PropertyFilterItem';

class PropertyFilter extends Component {

  render() {
    return (
      <div className='PropertyFilter'>
        <PropertyFilterItem
          title='Unvollständige Objekte'
          id='incomplete'
        />
        <PropertyFilterItem
          title='Fehlende Bilder'
          id='missing_images'
        />
        <PropertyFilterItem
          title='Fehlende Beschreibung'
          id='missing_description'
        />
      </div>
    );
  }

}

export default PropertyFilter;
