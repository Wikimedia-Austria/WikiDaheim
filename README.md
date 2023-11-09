# WikiDaheim

[![Build Status](https://github.com/Wikimedia-Austria/WikiDaheim/actions/workflows/node.js.yml/badge.svg)](https://github.com/Wikimedia-Austria/WikiDaheim/actions/workflows/node.js.yml)

## Development, Translation and Deployment

### Prerequisites

1. Install [Node.js](https://nodejs.org/), [yarn](https://yarnpkg.com/lang/en/)
2. Clone the repository
3. Run `yarn` in the root of the repository

### Develop

1. Run `yarn start`
2. Open http://0.0.0.0:3000/ in the browser

### Translate

1. Update the translation index by running `yarn build`
2. Run `yarn manage:translations` to get the translation status. Most of the used strings are now located in [`src/translations/extractedMessages.json`](src/translations/extractedMessages.json) and can be translated.

You can find and edit the languages files in [`src/translations/locales`](src/translations/locales).
Also translate all Views in [`src/views/`](src/views/) as well as their names in `views.json`.

### Deploy

The main branch of the repository will be automatically compiled and pushed to https://wikidaheim.at

To run on another server:

1. Run `yarn build`
2. transfer the `build/`-Folder to the root of a webserver.

## Overview of the WikiDaheim App

The WikiDaheim App
- consists of the backend retrieving data from various sources like lists (e.g. Liste der denkmalgeschützten Objekte in ...), wikidata (items assigned to Austria via property P17=Q40), configured wanted images (Bilderwünsche), intersection of Commons categories for general features of municipalities like schools or sport venues, etc. The backend is maintained by [pixelhaufen](https://github.com/pixelhaufen)
- and consists of the frontend (described here) and maintained by [reiterbene](https://github.com/reiterbene)
- and is based on wikipedia data maintained by the various Austrian communities in the wikiversum (see [WP:WikiDaheim](https://de.wikipedia.org/wiki/Wikipedia:WikiDaheim) and associated talk page).
  
## Dependencies and Structure of the frontend

The frontend is mainly built with the help of the following libraries:

- [React](https://reactjs.org/)  
  The base JS Framwork of the App.
- [Immutable.js](https://immutable-js.github.io/immutable-js/)  
  Prevents variables from being mutated.
- [Redux](https://redux.js.org/)  
  Management of the current app state. Also provides actions and reducers.
- [React Router](https://reacttraining.com/react-router/)  
  Routing of the app.
- [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) via React wrapper `react-mapbox-gl`  
  Rendering of the map.

### API

- The data is provided via the external "WikiDaheim"-API. The used endpoints can be found at [`src/api/wikidaheim.js`](src/api/wikidaheim.js).
- The map data is provided via the [Mapbox GL JS API](https://www.mapbox.com/mapbox-gl-js/api/).

#### Updating the Map Layer

The map layer is managed by Mapbox Studio. To update the map layer, open the [Mapbox Studio](https://studio.mapbox.com/) and edit the style. After saving the changes, the style can be published. The new style will be available after a few minutes.

#### Matching of Mapbox Boundaries and WikiData IDs

The wikidaheim API returns WikiData IDs for each municipality (name of the municipality, WikiData ID, Gemeindekennzahl). To map these IDs to the corresponding Mapbox-ID, the [`src/config/boundaries_mapped.json`](src/config/boundaries_mapped.json) file is used. This file combines the WikiData Index File ([`src/config/wikidata-gkz.json`](src/config/wikidata-gkz.json)) with the Mapbox Boundary Index File ([`src/config/boundaries.json`](src/config/boundaries.json)). Data are matched by the Gemeindekennzahl, which is used as unit_code in the Mapbox Boundary Index File. To merge the files automatically, run `yarn check:boundaries`. This will start a CLI tool that will try to merge the files. If the match can't be made automatically, the user will be asked to enter the correct match.

Updated mapbox boundary files have to be directly aquired from [Mapbox](https://docs.mapbox.com/data/boundaries/reference/). Currently the app uses Mapbox Boundaries v3.

The latest wikidata-gkz list can be downloaded from [the Wikidaheim API](https://api.wikidaheim.at/api.php?format=json&action=query&type=municipalitys).

#### Adding new item Categories

For new item Categories to appear in the app, they have to be added to [`src/components/Global/CategoryName.jsx`](src/components/Global/CategoryName.jsx). Please note that the category name has to be the same as the one used in the Wikidaheim API. Also do not forget to add the new category to the translation files.
New categories won't appear in the app if they are not provided by the Wikidaheim API as well. The category color and icon will be provided by the API.
Most icons are in tangram style and were provided by [Letitia Lehner, mooi-design.com](https://mooi-design.com) and are located in [Category:Logos of WikiDaheim](https://commons.wikimedia.org/wiki/Category:Logos_of_WikiDaheim).

### Components

The main entry point is [`src/index.js`](src/index.js). The main components are located in [`src/components/`](src/components/) and the static pages, accessible via the menu, in [`src/views/`](src/views/). The entrypoint for the Dashboard is [`src/components/Dashboard/index.jsx`](src/components/Dashboard/index.jsx).

The Dasboard is split into the following components:

- Map ([`src/components/Dashboard/Map/index.jsx`](src/components/Dashboard/Map/index.jsx))  
  Renders the Mapbox map and the map controls. Also reacts to state changes and updates the map accordingly.
- Sidebar ([`src/components/Dashboard/Sidebar/index.jsx`](src/components/Dashboard/Sidebar/index.jsx))  
  Renders the Searchbar, Information about the currently selected municipality, Filters and Item List. It implements also the gpx-export.

### Styles

The styles are located in [`src/scss/`](src/scss/) and are written in SCSS.

### State Management

The main state is located in [`src/redux/reducers/index.js`](src/redux/reducers/index.js). The state is split into the following parts:

- `app`: Contains the current state of the map, the loaded municipality and the currently selected list item
- `locale`: Contains the currently selected locale
- `menu`: Contains the current state of the menu

Changes to the state can be made by dispatching actions. The actions are located in [`src/redux/actions/`](src/redux/actions/). The reducers are located in [`src/redux/reducers/`](src/redux/reducers/).

### GPX Export
The GPX Exporter ist implemented as React Hook located in [`src/hooks/useDownloadGpx.js`](src/hooks/useDownloadGpx.js). It provides a `useDownloadGpx` function which converts the location list (provided to the hook as argument) to a gpx file and triggers a download. The locations are converted using the [`gpx-builder`](https://github.com/fabulator/gpx-builder) library.

### Editing Static Pages
Static pages are located in [`src/views/`](src/views/). The create a new page, simply create a HTML file with the slug name of the static page (slug = the permalink of the page), suffixed with the language of the page (e.g. pagename_en.html). Afterwards register the page by its slug in [views.json](src/views/views.json). When the option "in_menu" is enabled, the page will show up in the hamburger menu.


## Future Changes and Additions

These proposed changes are ideas for future technical improvements. The code base is from 2017 and therefore not up to date with the latest React standards. The following changes would improve the code base:

- Refactor the rather large [`src/components/Dashboard/Map/index.jsx`](src/components/Dashboard/Map/index.jsx) file.
- Switch all components to functional components.
- Convert the project to TypeScript and therefore get rid of Immutable.js.
- Replace the complex Redux state management with React Hooks & e.g. `zustand.js`.
