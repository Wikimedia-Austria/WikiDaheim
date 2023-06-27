const readline = require("readline");
const { promisify } = require("util");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question[promisify.custom] = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const boundaries = require("./src/config/boundaries.json");
const wikidata = require("./src/config/wikidata-gkz.json");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const newBoundaries = [];

const checkData = async () => {
  await asyncForEach(boundaries, async (b) => {
    const unitCode = b.unit_code;

    let match = wikidata.find(
      (w) => parseInt(w.gemeindekennzahl) === parseInt(unitCode)
    );

    while (!match) {
      const answer = await promisify(rl.question)(
        `${b.name}: GKZ not Found (Mapbox GKZ: ${unitCode}) | Please enter correct GKZ:`
      );
      match = wikidata.find(
        (w) => parseInt(w.gemeindekennzahl) === parseInt(answer)
      );
    }

    b.unit_code = "" + match.gemeindekennzahl;
    b.name = match.gemeinde.replace(/ *\([^)]*\) */g, "");
    b.wikidata = match.wikidata;

    newBoundaries.push(b);
  });

  fs.writeFile(
    "./src/config/boundaries_mapped.json",
    JSON.stringify(newBoundaries),
    "utf8",
    () => {
      console.log(
        "New Data written to ./scr/config/boundaries_mapped.json. Goodbye!"
      );
      process.exit();
    }
  );
};

checkData();
