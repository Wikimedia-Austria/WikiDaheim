import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getFeedbackFormToken } from 'src/api/wikidaheim';

class Feedback extends Component {

  constructor(props) {
    this.countdownTimeout = null;

    super(props);

    this.state = {
      token: null,
      countdown: -1,
      tokenIssued: null,
    };
  }

  async componentDidMount() {
    this.setState({
      token: null,
      countdown: -1,
      tokenIssued: null,
    });

    const token = await getFeedbackFormToken();
    console.log(token);
  }

  componentWillUnmount() {
    if(this.countdownTimeout) {
      clearTimeout(this.countdownTimeout);
    }
  }

  render() {

    const ItemClass = classNames(
      'TextPage',
      `TextPage--Feedback`
    );

    return (
      <div
        className={ ItemClass }
      >
        <h2>Feedback</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin malesuada id libero at vestibulum. Sed consequat ullamcorper tristique. </p>
        <form className="feedbackForm">
          <input type="text" placeholder="Name" required />
          <textarea placeholder="Nachricht" required></textarea>
          <input type="submit" value="Absenden" />
        </form>
        <p className="legal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin malesuada id libero at vestibulum. Sed consequat ullamcorper tristique. Morbi eleifend, erat quis iaculis dictum, enim lacus blandit sem, pulvinar sagittis arcu tellus ac diam. Praesent mollis metus nec interdum eleifend. Vestibulum mattis vel lacus a rutrum. Proin sed congue velit. Aenean efficitur varius sodales. Quisque volutpat rhoncus convallis. Aenean nec nunc tellus. Donec molestie dui non leo rutrum, facilisis cursus purus auctor. Aenean varius nisl in lacus vestibulum lacinia. Mauris ac eros arcu. Sed at aliquet nibh. Vivamus a mattis justo, at venenatis lectus.</p>
      </div>
    );
  }
}

export default connect(state => ({
  currentLanguage: state.locale.get('language'),
}))(Feedback);
