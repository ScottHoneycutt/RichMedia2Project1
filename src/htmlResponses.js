const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const documentation = fs.readFileSync(`${__dirname}/../client/documentation.html`);
const css = fs.readFileSync(`${__dirname}/../client/styles.css`);

// Responds with the main HTML page -SJH
const getIndex = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(index, 'utf8'),
  });
  response.write(index);
  response.end();
};

// Responds with the documentation HTML page -SJH
const getDocumentation = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(documentation, 'utf8'),
  });
  response.write(documentation);
  response.end();
};

module.exports = {
  getIndex,
  getDocumentation,
};
