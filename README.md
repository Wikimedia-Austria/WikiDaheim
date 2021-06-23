# WikiDaheim
[![Build Status](https://github.com/Wikimedia-Austria/WikiDaheim/actions/workflows/node.js.yml/badge.svg)](https://github.com/Wikimedia-Austria/WikiDaheim/actions/workflows/node.js.yml)

## Prerequisites
1. Install [Node.js](https://nodejs.org/), [yarn](https://yarnpkg.com/lang/en/)
2. Run `yarn`

## Develop
1. Run `yarn start`
2. Open http://0.0.0.0:3000/ in the browser

## Translate
1. Update the translation index by running `yarn build`
2. Run `yarn manage:translations` to get the translation status
3. check the console output for needed changes

You can find the languages files in `src/translations/locales`.

To add a new language add it to `src/translations/languages.json` and re-run the translation manager. A new file for the language will be created.
Also translate all Views in `src/views/` as well as their names in `views.json`.

## Deploy
1. Run `yarn build`
2. Transfer `build/` to the webserver running https://wikidaheim.at/
