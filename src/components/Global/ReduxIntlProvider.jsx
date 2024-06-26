import { connect } from "react-redux";
import { IntlProvider } from "react-intl";

import { FALLBACK_LANGUAGE } from "/src/config";

import de from "/src/translations/locales/de";
import en from "/src/translations/locales/en";
import hu from "/src/translations/locales/hu";
import it from "/src/translations/locales/it";

const messages = {
  de,
  en,
  hu,
  it,
};

if (!Intl.PluralRules) {
  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/locale-data/de");
  require("@formatjs/intl-pluralrules/locale-data/en");
  require("@formatjs/intl-pluralrules/locale-data/hu");
  require("@formatjs/intl-pluralrules/locale-data/it");
}
if (!Intl.RelativeTimeFormat) {
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/locale-data/de");
  require("@formatjs/intl-relativetimeformat/locale-data/en");
  require("@formatjs/intl-relativetimeformat/locale-data/hu");
  require("@formatjs/intl-relativetimeformat/locale-data/it");
}

function mapStateToProps(state) {
  const language = state.locale.get("language");

  return {
    locale: language,
    key: language,
    messages: messages[language],
    defaultLocale: FALLBACK_LANGUAGE,
  };
}

export default connect(mapStateToProps)(IntlProvider);
