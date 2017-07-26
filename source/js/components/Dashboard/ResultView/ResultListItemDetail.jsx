import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import EditLink from './EditLink';

class ResultListItemDetail extends Component {
  static propTypes = {
    editLink: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
    errorText: PropTypes.string,
    color: PropTypes.string,
    children: PropTypes.object,
  };

  render() {
    const { editLink, className, value, errorText, color, children } = this.props;

    let isMissing = true;
    let content = (
      <strong style={ { 'color': color } }>{ errorText }</strong>
    );

    if (value && value.length > 0) {
      isMissing = false;
      content = children;
    }

    const ItemClass = classNames({
      [`${ className }`]: true,
      [`${ className }--missing`]: isMissing,
    });

    return (
      <div className={ ItemClass }>
        { content }
        <EditLink href={ editLink } color={ color } />
      </div>
    );
  }
}

export default ResultListItemDetail;
