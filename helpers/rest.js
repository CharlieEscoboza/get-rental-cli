const fetch = require('node-fetch');

function checkStatus(resp) {
  if (resp.ok) {
    return resp;
  }

  return Promise.reject(`There was an error fetching the data: ${resp.message}`);
}

function getHTML(url, options = {}) {
  return fetch(url, options)
    .then(resp => checkStatus(resp))
    .then(resp => resp.text());
}

module.exports = {
  getHTML
};
