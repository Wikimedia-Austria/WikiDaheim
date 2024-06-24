import {
  WIKIDAHEIM_ENDPOINT /*, WIKIDAHEIM_FEEDBACK_ENDPOINT*/,
} from "/src/config";
import boundaries from "../config/boundaries_mapped.json";

const listCategories = () => {
  return fetch(
    `${WIKIDAHEIM_ENDPOINT}?format=json&action=query&type=structure`,
    {
      method: "get",
    }
  )
    .then((res) => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    })
    .then((json) => {
      return json;
    });
};

const getTownData = (location, categories, getWikiData) => {
  const categoriesString = categories.join("|");

  let locationQuery = "";

  if (location.wikidata) {
    locationQuery = `wikidata=${location.wikidata}`;
  } else if (location.iso && !location.name.includes("Wien")) {
    locationQuery = `gemeindekennzahl=${location.iso}`;
  } else {
    locationQuery = `latitude=${location.latitude}&longitude=${location.longitude}`;
  }

  return fetch(
    `${WIKIDAHEIM_ENDPOINT}?format=json&action=query&type=data&${locationQuery}&categories=${categoriesString}&wiki=${+getWikiData}`,
    {
      method: "get",
    }
  )
    .then((res) => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    })
    .then((json) => {
      const res = json;
      const mod = {
        selectedCats: categories,
      };

      // check if there were categories returned. if yes fix an API bug
      if ("categories" in json) {
        // check if the deep-nesting bug exists
        if (json.categories.length === 1 && Array.isArray(json.categories[0])) {
          mod.categories = json.categories[0];
        }
      }

      return Object.assign({}, res, mod);
    });
};

/*
const getFeedbackFormToken = () => {
  return fetch(`${WIKIDAHEIM_FEEDBACK_ENDPOINT}?token=new`, {
    method: "get",
  })
    .then((res) => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    })
    .then((json) => {
      return json.token;
    });
};

const submitFeedbackForm = (token, subject, message) => {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("subject", subject);
  formData.append("message", message);

  return fetch(`${WIKIDAHEIM_FEEDBACK_ENDPOINT}`, {
    method: "post",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    })
    .then((json) => {
      return json;
    });
};
*/

const search = (query, lang, maxResults = 10) => {
  // helper function to make string lower case,
  // replace "sankt" with "st." and remove umlauts
  const normalizeQueryString = (name) =>
    name.toLowerCase().replace("sankt", "st.");

  const normalizedQuery = normalizeQueryString(query);

  const filtered = boundaries.filter((town) =>
    normalizeQueryString(town.name).includes(normalizedQuery)
  );

  const mapped = filtered
    // remove duplicates from mapbox (due to multiple boundaries per town from municipality fusion)
    .filter(
      (town, index) =>
        filtered.findIndex((e) => e.unit_code === town.unit_code) === index
    )
    // sort by name - and move matches staring with query to top
    .sort((a, b) => {
      const aName = normalizeQueryString(a.name);
      const bName = normalizeQueryString(b.name);
      if (
        aName.startsWith(normalizedQuery) &&
        !bName.startsWith(normalizedQuery)
      )
        return -1;
      if (
        !aName.startsWith(normalizedQuery) &&
        bName.startsWith(normalizedQuery)
      )
        return 1;
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    })
    // slice to max results
    .slice(0, maxResults)
    // map to match legacy mapbox format
    .map((town) => ({
      id: "place." + town.unit_code,
      properties: {
        wikidata: town.wikidata,
      },
      text: town.name,
      place_name: town.name,
      geometry: {
        type: "Point",
        coordinates: town.centroid,
      },
      context: [
        {
          id: "region." + String(town.unit_code).slice(0, 1),
          text: {
            1: "Burgenland",
            2: "Kärnten",
            3: "Niederösterreich",
            4: "Oberösterreich",
            5: "Salzburg",
            6: "Steiermark",
            7: "Tirol",
            8: "Vorarlberg",
            9: "Wien",
          }[String(town.unit_code).slice(0, 1)],
        },
      ],
    }));
  return Promise.resolve(mapped);
};

const wikidaheimAPI = {
  listCategories,
  getTownData,
  //getFeedbackFormToken,
  //submitFeedbackForm,
  search,
};

export default wikidaheimAPI;
