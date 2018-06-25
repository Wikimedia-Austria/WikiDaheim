import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

export default class CategoryName extends Component {
  static propTypes = {
    category: PropTypes.object,
  };
  render() {
    const { category } = this.props;

    switch (category.get('name')) {
      case 'denkmalliste':
        return (<FormattedMessage
          id='category.denkmalliste'
          defaultMessage='Denkmale'
        />);

      case 'naturdenkmal':
        return (<FormattedMessage
          id='category.naturdenkmal'
          defaultMessage='Natur'
        />);

      case 'kellergasse':
        return (<FormattedMessage
          id='category.kellergasse'
          defaultMessage='Kellergassen'
        />);

      case 'publicart':
        return (<FormattedMessage
          id='category.publicart'
          defaultMessage='Public Art'
        />);

      case 'commons':
        return (<FormattedMessage
          id='category.commons'
          defaultMessage='Gemeingüter'
        />);

      default:
        return (<span>{ category.get('title') }</span>);
    }
  }
}
