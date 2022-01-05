const { allowedHttpMethods, http } = require('./http');

require('dotenv').config();

async function uploadPhoto(path) {
  var data = new FormData();
  data.append('upload', fs.createReadStream(path));
  data.append('regions', 'pl');

  const response = await http({
    method: allowedHttpMethods.post,
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
