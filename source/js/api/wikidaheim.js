import { WIKIDAHEIM_ENDPOINT } from 'config/config';

const listCategories = () => {
  return fetch(`${ WIKIDAHEIM_ENDPOINT }?format=json&action=query&type=structure`, {
    method: 'get',
  }).then((res) => {
    if (!res.ok) throw Error(res.statusText);
    return res.json();
  }).then(json => {
    return json;
  });
};

const getTownData = (wikidata, categories, getWikiData) => {
  const categoriesString = categories.join('|');

  return fetch(`${ WIKIDAHEIM_ENDPOINT }?format=json&action=query&type=data&wikidata=${ wikidata }&categories=${ categoriesString }&wiki=${ +getWikiData }`, {
    method: 'get',
  }).then((res) => {
    if (!res.ok) throw Error(res.statusText);
    return res.json();
  }).then(json => {
    const res = json;
    const mod = {
      selectedCats: categories,
    };

    // check if there were categories returned. if yes fix an API bug
    if ('categories' in json) {
      // check if the deep-nesting bug exists
      if (json.categories.length === 1 && Array.isArray(json.categories[0])) {
        mod.categories = json.categories[0];
      }
    }

    return Object.assign({}, res, mod);
  });
};

export default {
  listCategories,
  getTownData,
};
