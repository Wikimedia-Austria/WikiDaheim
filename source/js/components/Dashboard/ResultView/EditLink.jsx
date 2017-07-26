import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditLink extends Component {
  static propTypes = {
    href: PropTypes.string,
    color: PropTypes.string,
  };
  render() {
    const { href, color } = this.props;

    return (
      <a
        href={ href }
        target='_blank'
        rel='noopener noreferrer'
        style={ { 'color': color } }
      >
        zum Eintrag
      </a>
    );
  }
}

export default EditLink;
