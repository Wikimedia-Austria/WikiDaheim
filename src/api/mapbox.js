import 'es6-promise';
import { COUNTRY_CODE, MAPBOX_API_KEY } from 'config/config';
import languages from 'translations/languages.json';

const search = (query, lang) => {
  if (query.length === 0) {
    return new Promise((res) => res([]));
  }

  const languageCode = languages.filter(l => l.locale === lang).map(l => l.mapbox_language_code);

  return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ query }.json?access_token=${ MAPBOX_API_KEY }&country=${ COUNTRY_CODE }&language=${ languageCode }&types=place`, {
    method: 'get',
  }).then((res) => {
    if (!res.ok) throw Error(res.statusText);
    return res.json();
  }).then(json => {
    return json.features;
  });
};

export default {
  search,
};
