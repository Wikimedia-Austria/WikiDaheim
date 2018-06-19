# WikiDaheim

## Prerequisites
1. Install [Node.js](https://nodejs.org/), [yarn](https://yarnpkg.com/lang/en/)
2. Run `yarn install`

## Develop
1. Run `yarn run dev`
2. Open http://0.0.0.0:3000/ in the browser

## Translate
1. Update the translation index by running `yarn run build`
2. Run `yarn run manage:translations` to get the translation status
3. check the console output for needed changes

You find the languages files in `source/translations/locales`

To add a new language add it to `source/translations/languages.json`.
Also translate all Views in `source/js/views/` as well as their name in `views.json`.

## Deploy
1. Run `yarn run build`
2. Transfer `build/` to the webserver running https://wikidaheim.at/
