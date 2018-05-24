import React, { Component } from 'react';

import __html from './index.content.html';

export default class Credits extends Component {
  render() {
    return (
      <div
        className='TextPage TextPage-Credits'
        dangerouslySetInnerHTML={ { __html } }  // eslint-disable-line react/no-danger
      />
    );
  }
}
