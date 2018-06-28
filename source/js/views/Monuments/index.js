import React, { Component } from 'react';

import __html from './content.html';

export default class About extends Component {
  render() {
    return (
      <div
        className='TextPage'
        dangerouslySetInnerHTML={ { __html } }  // eslint-disable-line react/no-danger>
      />
    );
  }
}
