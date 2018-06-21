import { connect } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';

import localeDE from 'react-intl/locale-data/de';
import localeEN from 'react-intl/locale-data/en';
import localeHU from 'react-intl/locale-data/hu';

import { FALLBACK_LANGUAGE } from 'config/config';
import * as Messages from '../../../translations/locales';

addLocaleData([...localeDE, ...localeEN, ...localeHU]);

function mapStateToProps(state) {
  const language = state.locale.get('language');

  return {
    locale: language,
    key: language,
    messages: Messages[language],
    defaultLocale: FALLBACK_LANGUAGE,
  };
}

export default connect(mapStateToProps)(IntlProvider);
