import { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}
ScrollToTop.propTypes = {
  location: PropTypes.any,
  children: PropTypes.any,
};

export default withRouter(ScrollToTop);
