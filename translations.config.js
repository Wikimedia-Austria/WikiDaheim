const manageTranslations = require('react-intl-translations-manager').default;
const languages = require('./source/translations/languages.json');


manageTranslations({
  messagesDirectory: 'source/translations/extractedMessages',
  translationsDirectory: 'source/translations/locales/',
  languages: languages.map((l) => l.locale),
});
