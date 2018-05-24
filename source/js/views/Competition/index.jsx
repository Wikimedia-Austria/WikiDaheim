import React, { Component } from 'react';

import __html from './index.content.html';

export default class Competition extends Component {
  render() {
    return (
      <div
        className='TextPage TextPage-Competition'
        dangerouslySetInnerHTML={ { __html } }  // eslint-disable-line react/no-danger
      />
    );
  }
}
