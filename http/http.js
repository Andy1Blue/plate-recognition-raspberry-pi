const axios = require('axios');

module.exports = function http({ method, url, data, headers }) {
  return axios({ method, url, data, headers });
};
