const axios = require('axios');

const allowedHttpMethods = {
  post: 'post',
};

function http({ method, url, data, headers }) {
  return axios({ method, url, data, headers });
}

module.exports = { allowedHttpMethods, http };
