import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import wikidaheim from 'api/wikidaheim';

class Feedback extends Component {

  constructor(props) {
    super(props);

    this.countdownTimeout = null;

    this.state = {
      token: null,
      countdown: -1,
      tokenIssued: null,
      subject: '',
      message: '',
    };

    this.tickCountdown = this.tickCountdown.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  async componentDidMount() {
    this.setState({
      token: null,
      countdown: -1,
      tokenIssued: null,
    });

    try {
      const token = await wikidaheim.getFeedbackFormToken();
      console.log(token);

      this.setState({
        token,
        countdown: 30
      });

      this.countdownTimeout = setTimeout(this.tickCountdown, 1000);
    } catch(err) {
      console.error(err);
    }

  }

  componentWillUnmount() {
    if(this.countdownTimeout) {
      clearTimeout(this.countdownTimeout);
    }
  }

  tickCountdown() {
    if(this.state.countdown >= 1) {
      this.setState({
        countdown: this.state.countdown -1
      });
    }

    this.countdownTimeout = setTimeout(this.tickCountdown, 1000);
  }

  async submitFeedback() {
    const { token, subject, message, countdown } = this.state;

    if( !token || countdown < 0 ) {
      alert('No Token provided');
      return;
    }

    if( countdown > 0 ) {
      alert('Please wait until the countdown ins finished.');
      return;
    }

    if( subject.length < 5 ) {
      alert('Please provide a longer subject.');
      return;
    }

    if( message.length < 20 ) {
      alert('Please provide a longer message.');
      return;
    }

    try {
      const res = await wikidaheim.submitFeedbackForm(
        token,
        subject,
        message
      );

      console.log(res);
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    const { countdown, subject, message } = this.state;

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
        <form className="feedbackForm" onSubmit={(e) => { e.preventDefault(); this.submitFeedback(); }}>
          <input type="text" placeholder="Betreff" value={subject} onChange={(e) => this.setState({ subject: e.target.value }) } required />
          <textarea placeholder="Nachricht" value={message} onChange={(e) => this.setState({ message: e.target.value }) } required></textarea>
          <input type="submit" value={ `Absenden ${ countdown > 0 ? `(${countdown})` : '' }` } disabled={ countdown > 0 || countdown < 0 }  />
        </form>
        <p className="legal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin malesuada id libero at vestibulum. Sed consequat ullamcorper tristique. Morbi eleifend, erat quis iaculis dictum, enim lacus blandit sem, pulvinar sagittis arcu tellus ac diam. Praesent mollis metus nec interdum eleifend. Vestibulum mattis vel lacus a rutrum. Proin sed congue velit. Aenean efficitur varius sodales. Quisque volutpat rhoncus convallis. Aenean nec nunc tellus. Donec molestie dui non leo rutrum, facilisis cursus purus auctor. Aenean varius nisl in lacus vestibulum lacinia. Mauris ac eros arcu. Sed at aliquet nibh. Vivamus a mattis justo, at venenatis lectus.</p>
      </div>
    );
  }
}

export default connect(state => ({
  currentLanguage: state.locale.get('language'),
}))(Feedback);
