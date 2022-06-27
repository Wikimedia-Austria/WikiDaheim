import { COUNTRY_CODE, MAPBOX_API_KEY } from 'config';
import languages from 'translations/languages.json';

const search = (query, lang, region) => {
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
    const features = json.features;

    // if we have to filter by a specific region we have to do it manually here
    if( region ) {
      return features.filter(feature => {
        if(
          feature.context && feature.context.length > 1 &&
          region === feature.context[0].short_code
        ) {
          return true;
        }

        return false;
      });
    }

    return features;
  });
};

const mapBoxAPI = {
  search
};

export default mapBoxAPI;
