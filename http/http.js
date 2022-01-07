const axios = require('axios');

const allowedHttpMethod = {
  post: 'post',
};

function http({ method, url, data, headers }) {
  return axios({ method, url, data, headers });
}

module.exports = { allowedHttpMethod, http };
