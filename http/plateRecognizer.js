var fs = require('fs');
const FormData = require('form-data');
const { allowedHttpMethod, http } = require('./http');

require('dotenv').config();

async function uploadPhoto(path) {
  var data = new FormData();
  data.append('upload', fs.createReadStream(path));
  data.append('regions', 'pl');

  const response = await http({
    method: allowedHttpMethod.post,
    url: process.env.PLATE_RECOGNIZER_API_URL,
    headers: {
      Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_KEY}`,
      ...data.getHeaders(),
    },
    data,
  });

  return response.data;
}

module.exports = {
  uploadPhoto,
};
