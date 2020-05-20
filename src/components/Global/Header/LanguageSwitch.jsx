import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setLanguage } from 'actions/locale';
import Dropdown from 'react-dropdown';

import languages from 'translations/languages.json';

class LanguageSwitch extends Component {
  static propTypes = {
    currentLanguage: PropTypes.string,
    // from react-redux connect
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedLanguage) {
    const { dispatch } = this.props;

    dispatch(setLanguage(selectedLanguage.value));
  }

  render() {
    const { currentLanguage } = this.props;

    return (
      <Dropdown
        value={ currentLanguage }
        onChange={ this.handleChange }
        placeholder="TEST"
        options={ languages.map((l) => ({
          value: l.locale,
          label: l.locale,
        })) }
      />
    );
  }

}

export default connect(state => ({
  currentLanguage: state.locale.get('language'),
}))(LanguageSwitch);
