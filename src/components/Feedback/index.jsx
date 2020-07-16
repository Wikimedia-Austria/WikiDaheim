import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { RotateSpinner } from "react-spinners-kit";
import { FormattedMessage } from 'react-intl';

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
      submitStatus: false,
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

    this.setState({
      submitStatus: 'loading'
    });

    try {
      const res = await wikidaheim.submitFeedbackForm(
        token,
        subject,
        message
      );

      if(res.OK) {
        this.setState({
          submitStatus: 'finish'
        });
      } else {
        alert('Error – please try again.');

        this.setState({
          submitStatus: false
        });
      }
    } catch(err) {
      console.error(err);

      alert('Error – please try again.');

      this.setState({
        submitStatus: false
      });
    }
  }

  render() {
    const { countdown, subject, message, submitStatus } = this.state;

    const ItemClass = classNames(
      'TextPage',
      `TextPage--Feedback`
    );



    return (
      <div
        className={ ItemClass }
      >
        <h2>
          <FormattedMessage
            id='feedback.title'
            description='Title for the Feedback-Page'
            defaultMessage='Feedback'
          />
        </h2>
        <p>
          <FormattedMessage
            id='feedback.intro'
            description='Intro Text for the Feedback-Page'
            defaultMessage='Hinterlassen Sie uns Feedback.'
          />
        </p>
        {submitStatus !== 'finish' && (
          <form className="feedbackForm" onSubmit={(e) => { e.preventDefault(); this.submitFeedback(); }}>
            <FormattedMessage
              id='feedback.subject'
              description='Subject Label for the Feedback-Page'
              defaultMessage='Betreff'
            >
              { txt => (
                <input type="text" placeholder={txt} value={subject} onChange={(e) => this.setState({ subject: e.target.value }) } required />
              )}
            </FormattedMessage>
            <FormattedMessage
              id='feedback.message'
              description='Message Label for the Feedback-Page'
              defaultMessage='Nachricht'
            >
              { txt => (
                <textarea placeholder={txt} value={message} onChange={(e) => this.setState({ message: e.target.value }) } required></textarea>
              )}
            </FormattedMessage>
            <FormattedMessage
              id='feedback.submit'
              description='Submit Text for the Feedback-Page'
              defaultMessage='Absenden'
            >
              { txt => (
                <input
                  type="submit"
                  value={ `${txt} ${ countdown > 0 ? `(${countdown})` : '' }` }
                  disabled={ countdown > 0 || countdown < 0 || submitStatus !== false }
                />
              )}
            </FormattedMessage>
            {submitStatus === 'loading' && (
              <div className="loader">
              <RotateSpinner
                color={ '#fff' }
                loading={ true }
                className="spinner"
                size={25}
              />
            </div>
            )}
          </form>
        )}

        {submitStatus === 'finish' && (
          <div class="finishInfo">
            <h2>
              <FormattedMessage
                id='feedback.success'
                description='Success Text for the Feedback-Page'
                defaultMessage='Erfolgreich versandt. Vielen Dank'
              />
            </h2>
          </div>
        )}

        <p className="legal">
          <FormattedMessage
            id='feedback.legal'
            description='Legal Text for the Feedback-Page'
            defaultMessage='LEGAL TEXT'
          />
        </p>
      </div>
    );
  }
}

export default connect(state => ({
  currentLanguage: state.locale.get('language'),
}))(Feedback);
