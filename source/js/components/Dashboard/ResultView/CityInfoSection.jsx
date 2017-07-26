import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CityInfoSection extends Component {
  static propTypes = {
    name: PropTypes.string,
    inArticle: PropTypes.bool,
    editLink: PropTypes.string,
  };

  render() {
    const { name, inArticle, editLink } = this.props;

    const ItemClass = classNames({
      'CityInfo-Section': true,
      'CityInfo-Section--present': inArticle,
    });

    return (
      <a
        className={ ItemClass }
        href={ `${ editLink.replace('&action=edit', '') }#${ name }` }
        target='_blank'
        rel='noopener noreferrer'
      >
        { name }
        <span />
      </a>
    );
  }

}

export default CityInfoSection;
