const readline = require('readline');
const { promisify } = require('util');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question[promisify.custom] = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const boundaries = require('./src/config/boundaries.json');
const wikidata = require('./src/config/wikidata-gkz.json');

const diff = (diffMe, diffBy) => diffMe.split(diffBy).join('')

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const newBoundaries = [];

const checkData = async () => {
  await asyncForEach(boundaries, async b => {
    const unitCode = b.unit_code;

    const match = wikidata.find(w => parseInt(w.gemeindekennzahl) === parseInt(unitCode));

    if(match) {
      const difference = diff(b.name.replace(/ *\([^)]*\) */g, "").replace('Sankt', 'St.'), match.gemeinde.replace(/ *\([^)]*\) */g, "").replace('Sankt', 'St.'));

      if(difference.length > 0) {
        const answer = await promisify(rl.question)(`${b.name}: Wikidata Name not matching: ${match.gemeinde.replace(/ *\([^)]*\) */g, "")} (Mapbox: ${unitCode} / Wikidata: ${match.gemeindekennzahl}) | 'y' for OK, otherwise enter correct GKZ:`);

        if(answer !== '' && answer !== 'y') {
          b.unit_code = '' + answer;
          console.log(`GKZ overwritten with ${answer}`);
        }
      }
    } else {
      const match = wikidata.find(w => b.name.replace(/ *\([^)]*\) */g, "") === w.gemeinde.replace(/ *\([^)]*\) */g, ""));

      if(match) {
        const answer = await promisify(rl.question)(`${b.name}: GKZ not Found, Match by Name: ${match.gemeinde.replace(/ *\([^)]*\) */g, "")} (Mapbox: ${unitCode} / Wikidata: ${match.gemeindekennzahl}) | 'y' to use GKZ '${match.gemeindekennzahl}', otherwise enter correct GKZ:`);

        if(answer !== '' && answer !== 'y') {
          b.unit_code = '' + answer;
          console.log(`GKZ overwritten with ${answer}`);
        }
      } else {
        const answer = await promisify(rl.question)(`${b.name}: GKZ not Found, no Match by Name (Mapbox GKZ: ${unitCode}) | Please enter correct GKZ:`);
        b.unit_code = '' + answer;
        console.log(`GKZ overwritten with ${answer}`);
      }
    }

    newBoundaries.push(b);
  });

  fs.writeFile('./src/config/boundaries_mapped.json', JSON.stringify(newBoundaries), 'utf8', () => {
    console.log('New Data written to ./scr/config/boundaries_mapped.json. Goodbye!');
    process.exit();
  });
}

checkData();
