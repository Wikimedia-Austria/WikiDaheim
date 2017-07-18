import 'es6-promise';
import { LANGUAGE_CODE, COUNTRY_CODE, MAPBOX_API_KEY } from 'config/config';

const search = (query) => {
  if (query.length === 0) {
    return new Promise((res) => res([]));
  }

  return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ query }.json?access_token=${ MAPBOX_API_KEY }&country=${ COUNTRY_CODE }&language=${ LANGUAGE_CODE }&types=place`, {
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
