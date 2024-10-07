const http = require('http');
const queryString = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// URL struct for faster processing than a big if-else statement -SJH
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/styles.css': htmlHandler.getCss,
  '/getCountryCapital': jsonHandler.getCountryCapital,
  '/getCountryNamesByRegion': jsonHandler.getCountriesByRegion,
  '/getFullCountryData': jsonHandler.getFullCountryData,
  '/getAllCountryNames': jsonHandler.getAllCountryNames,
  '/addCountry': jsonHandler.addCountry,
  '/removeCountry': jsonHandler.removeCountry,
};

// Define what to do when this server recieves a request (what response it sends).
// This code executes on the server, response is sent to the client. -SJH
const onRequest = (request, response) => {
  // Checking for queries and embedding them in the request object if found. -SJH
  request.queries = false;
  if (request.url.includes('?')) {
    const justUrl = request.url.split('?')[0];
    request.queries = queryString.parse(request.url.split('?')[1]);
    request.url = justUrl;
  }

  if (urlStruct[request.url]) {
    urlStruct[request.url](request, response);
  } else {
    jsonHandler.getNotFound(request, response);
  }

//   // Index page -SJH
//   if (request.url === '/') {
//     htmlHandler.getIndex(request, response);
//   } else if (request.url === '/styles.css') { // Css data -SJH
//     htmlHandler.getCss(request, response);
//   } else if (request.url === '/getUsers') { // All Json or head responses below. -SJH
//     jsonHandler.getUsers(request, response);
//   } else if (request.url === '/addUser') {
//     jsonHandler.addUser(request, response);
//   } else if (request.url === '/notReal') {
//     jsonHandler.getNotFound(request, response);
//   } else {
//     jsonHandler.getNotFound(request, response);
//   }
};

// Starting the server, specifying the port, and creating a callback function once it's running -SJH
http.createServer(onRequest).listen(port, () => {
});
