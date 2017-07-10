import React, { Component } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_SIZE = 24;
const icons = {};

const req = require.context('../../../assets/icons', true, /.*\.svg$/);

req.keys().forEach((key) => {
  const icon = req(key).default;
  const dimensions = icon.viewBox && icon.viewBox.split(' ');

  let width = DEFAULT_SIZE;
  let height = DEFAULT_SIZE;

  if (dimensions && dimensions.length === 4) {
    width = dimensions[2];
    height = dimensions[3];
  }

  icons[icon.id] = {
    href: `#${ icon.id }`,
    width,
    height,
  };
});

export default class Icon extends Component {
  render() {
    const {
      className,
      width,
      height,
      glyph,
      style,
    } = this.props;

    const icon = icons[glyph];

    if (!icon) {
      console.error(`Icon.jsx - There is no "${ glyph }" glyph`); // eslint-disable-line no-console

      return null;
    }

    const combinedClassName = className ? `Icon Icon--${ glyph } ${ className }` : `Icon Icon--${ glyph }`;
    const w = parseInt(width, 10) || icon.width;
    const h = parseInt(height, 10) || icon.height;

    return (
      <svg
        style={ style }
        className={ combinedClassName }
        width={ w }
        height={ h }
      >
        <use xlinkHref={ icon.href } />
      </svg>
    );
  }
}

Icon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  glyph: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
