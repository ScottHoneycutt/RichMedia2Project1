const fs = require('fs');
const queryString = require('querystring');

// Loading in json files -SJH
const resourceNotFound = fs.readFileSync(`${__dirname}/../data/resourceNotFound.json`);
const badRequestMissingParam = fs.readFileSync(`${__dirname}/../data/missingParam.json`);
const badRequestInvalidParam = fs.readFileSync(`${__dirname}/../data/invalidParam.json`);
const countriesJson = fs.readFileSync(`${__dirname}/../data/countries.json`);

const countriesObj = JSON.parse(countriesJson);

// Serves as an "IndexOf" function based upon a country name.
// Returns the index of a country in the countriesObj. -SJH
const searchForCountryByName = (countryName) => {
  // If countryName is falsey, return early -SJH
  if (!countryName) {
    return -1;
  }

  // Find country from the json object -SJH
  let countryFoundFlag = false;
  let countryIndex;
  for (let i = 0; i < countriesObj.length; i++) {
    if (countriesObj[i].name === countryName) {
      countryFoundFlag = true;
      countryIndex = countriesObj[i];
    }
  }
  // Country was found -> return index where country was found.
  // Country was not found -> return -1. -SJH
  if (countryFoundFlag) {
    return countryIndex;
  }
  return -1;
};

// User wants the capital of a country (GET or HEAD request handled here) -SJH
const getCountryCapital = (request, response) => {
  // Check for search queries -SJH
  if (request.queries) {
    console.log(request.queries);
    if (Object.keys(request.queries).includes('country')) {
      // Find country from the json object -SJH
      let countryFoundFlag = false;
      let country;
      for (let i = 0; i < countriesObj.length; i++) {
        if (countriesObj[i].name === request.queries.country) {
          countryFoundFlag = true;
          country = countriesObj[i];
        }
      }
      // If a country was found, return its data -SJH
      if (countryFoundFlag) {
        response.writeHead(200, {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(country.capital), 'utf8'),
        });
        if (request.method === 'GET') {
          response.write(JSON.stringify(country.capital));
        }
        response.end();
        return;
      }
      // Country name was invalid if we get this far. -SJH
      response.writeHead(400, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(badRequestInvalidParam, 'utf8'),
      });
      if (request.method === 'GET') {
        response.write(badRequestInvalidParam);
      }
      response.end();
      return;
    }
  }
  // If we reach this far, there was a missing parameter (no country search param) -SJH
  response.writeHead(400, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(badRequestMissingParam, 'utf8'),
  });
  if (request.method === 'GET') {
    response.write(badRequestMissingParam);
  }
  response.end();
};

// User wants all countries that belong to a certain region. -SJH
const getCountriesByRegion = (request, response) => {
  // Check for search queries -SJH
  if (request.queries) {
    console.log(request.queries);
    if (Object.keys(request.queries).includes('region')) {
      // Iterate through all countries and add all matches to the list of names -SJH
      const countryNames = [];
      for (let i = 0; i < countriesObj.length; i++) {
        if (countriesObj[i].region === request.queries.region) {
          countryNames.push(countriesObj[i].name);
        }
      }
      // Write the response, accounting for GET or HEAD requests -SJH
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(countryNames), 'utf8'),
      });
      if (request.method === 'GET') {
        response.write(JSON.stringify(countryNames));
      }
      response.end();
      return;
    }
  }
  // If we reach this far, there was a missing parameter (no country search param) -SJH
  response.writeHead(400, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(badRequestMissingParam, 'utf8'),
  });
  if (request.method === 'GET') {
    response.write(badRequestMissingParam);
  }
  response.end();
};

// Client wants the full JSON data of a specific country. GET or HEAD. -SJH
const getFullCountryData = (request, response) => {
  // Check for search queries -SJH
  if (request.queries) {
    console.log(request.queries);
    if (Object.keys(request.queries).includes('country')) {
      // Find country from the json object -SJH
      let countryFoundFlag = false;
      let country;
      for (let i = 0; i < countriesObj.length; i++) {
        if (countriesObj[i].name === request.queries.country) {
          countryFoundFlag = true;
          country = countriesObj[i];
        }
      }
      // If a country was found, return its data -SJH
      if (countryFoundFlag) {
        response.writeHead(200, {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(country), 'utf8'),
        });
        if (request.method === 'GET') {
          response.write(JSON.stringify(country));
        }
        response.end();
        return;
      }
      // Country name was invalid if we get this far. -SJH
      response.writeHead(400, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(badRequestInvalidParam, 'utf8'),
      });
      if (request.method === 'GET') {
        response.write(badRequestInvalidParam);
      }
      response.end();
      return;
    }
  }
  // If we reach this far, there was a missing parameter (no country search param) -SJH
  response.writeHead(400, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(badRequestMissingParam, 'utf8'),
  });
  if (request.method === 'GET') {
    response.write(badRequestMissingParam);
  }
  response.end();
};

// User wants a list of all country names. GET or HEAD requests handled. -SJH
const getAllCountryNames = (request, response) => {
  // Create the response data (list of all country names) -SJH
  const countryNameList = [];
  for (let i = 0; i < countriesObj.length; i++) {
    countryNameList[i] = countriesObj[i].name;
  }

  // Send response, checking if GET or HEAD request and responding accordingly -SJH
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(countryNameList), 'utf8'),
  });
  if (request.method === 'GET') {
    response.write(JSON.stringify(countryNameList));
  }
  response.end();
};

// resourceNotFound case response -SJH
const getNotFound = (request, response) => {
  response.writeHead(404, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(resourceNotFound, 'utf8'),
  });
  if (request.method === 'GET') {
    response.write(resourceNotFound);
  }
  response.end();
};

//= ================================================================================================
// POST REQUEST HANDLING ---------------------------------------------------------------------------
//= ================================================================================================

// Part 2 of adding a new country (after the body is parsed) -SJH
const addCountryPt2 = (request, response) => {
  const newName = request.body.name;
  const newCapital = request.body.capital;
  const newRegion = request.body.region;
  const countryIndex = searchForCountryByName(newName);

  // First, check to see if there were name, capital, and region parameters passed in -SJH
  if (!newName || !newCapital || !newRegion) {
    response.writeHead(400, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(badRequestMissingParam, 'utf8'),
    });
    response.write(badRequestMissingParam);
    response.end();
  } else if (countryIndex !== -1) {
    // Modify existing country and send back an update status code -SJH
    countriesObj[countryIndex].capital = newCapital;
    countriesObj[countryIndex].region = newRegion;
    response.writeHead(204, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(countriesObj[countryIndex]), 'utf8'),
    });
    response.end();
  } else {
    // Create new country and send success code/json back -SJH
    const newCountry = { name: newName, capital: newCapital, region: newRegion };
    countriesObj.push(newCountry);

    response.writeHead(201, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(newCountry), 'utf8'),
    });
    response.write(newCountry);
    response.end();
  }
};

// Part 2 of adding a new country (after the body is parsed) -SJH
const removeCountryPt2 = (request, response) => {
  const countryName = request.body.name;
  const countryIndex = searchForCountryByName(countryName);

  // First, check to see if the name parameter was passed in -SJH
  if (!countryName) {
    response.writeHead(400, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(badRequestMissingParam, 'utf8'),
    });
    response.write(badRequestMissingParam);
    response.end();
  } else if (countryIndex !== -1) {
    // Send back failure case: Could not find country to delete -SJH
    response.writeHead(400, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(badRequestInvalidParam, 'utf8'),
    });
    response.write(badRequestInvalidParam);
    response.end();
  } else {
    // Delete country and tell the client that the action succeeded. -SJH
    const deletedCountry = countriesObj.splice(countryIndex, countryIndex);
    response.writeHead(204, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(deletedCountry), 'utf8'),
    });
    response.end();
  }
};

// Parses the body for post requests - SJH
const handleParsedBody = async (request, response, callback) => {
  const body = [];

  // Storing the data chunks for the body in a body array -SJH
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Request has finished sending body data -SJH
  await request.on('end', () => {
    // Convert that array into a single string -SJH
    const bodyString = Buffer.concat(body).toString();
    request.body = queryString.parse(bodyString);
    callback(request, response);
  });
};

// Part 1 of adding a new country. Parse the body, passing in part 2 as a callback function -SJH
const addCountry = async (request, response) => {
  handleParsedBody(request, response, addCountryPt2);
};

const removeCountry = async (request, response) => {
  handleParsedBody(request, response, removeCountryPt2);
};

module.exports = {
  getCountryCapital,
  getAllCountryNames,
  getCountriesByRegion,
  getFullCountryData,
  getNotFound,
  addCountry,
  removeCountry,
};
