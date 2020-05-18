import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

export default class SourceName extends Component {
  static propTypes = {
    source: PropTypes.string,
  };

  render() {
    const { source } = this.props;

    let message = '';

    switch (source) {
      case 'Commons':
        message = (<FormattedMessage
          id='source.commons'
          defaultMessage='Commons'
        />);
        break;

      case 'Denkmalliste':
        message = (<FormattedMessage
          id='source.monument_list'
          defaultMessage='Denkmalliste'
        />);
        break;

      case 'Kunstwerk':
        message = (<FormattedMessage
          id='source.art'
          defaultMessage='Kunstwerk'
        />);
        break;

      case 'Kellergasse':
        message = (<FormattedMessage
          id='source.cellar_street'
          defaultMessage='Kellergasse'
        />);
        break;

      case 'Naturdenkmal':
        message = (<FormattedMessage
          id='source.nature_monument'
          defaultMessage='Naturdenkmal'
        />);
        break;

      case 'Höhle':
        message = (<FormattedMessage
          id='source.cave'
          defaultMessage='Höhle'
        />);
        break;

      case 'Landschaftsteil':
        message = (<FormattedMessage
          id='source.landscape_part'
          defaultMessage='Landschaftsteil'
        />);
        break;

      case 'Naturpark':
        message = (<FormattedMessage
          id='source.nature_park'
          defaultMessage='Naturpark'
        />);
        break;

      case 'Naturschutzgebiet':
        message = (<FormattedMessage
          id='source.nature_reserve'
          defaultMessage='Naturschutzgebiet'
        />);
        break;

      case 'Bilderwunsch':
        message = (<FormattedMessage
          id='source.image_request'
          defaultMessage='Bilderwunsch'
        />);
        break;

      case 'Wikidata':
        message = (<FormattedMessage
          id='source.wikidata'
          defaultMessage='Wikidata'
        />);
        break;

      default:
        message = (<span>{ source }</span>);
    }

    return (<span className={ `SourceName--${ source }` }>{ message }</span>);
  }
}
