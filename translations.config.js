const manageTranslations = require('react-intl-translations-manager').default;
const languages = require('./src/translations/languages.json');


manageTranslations({
  messagesDirectory: 'src/translations/extractedMessages',
  translationsDirectory: 'src/translations/locales/',
  languages: languages.map((l) => l.locale),
});
