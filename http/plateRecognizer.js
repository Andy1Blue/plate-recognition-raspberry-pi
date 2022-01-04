const http = require('./http');

require('dotenv').config();

async function uploadPhoto(path) {
  var data = new FormData();
  data.append('upload', fs.createReadStream(path));
  data.append('regions', 'pl');

  const response = await http({
    method: 'post',
    url: 'https://api.platerecognizer.com/v1/plate-reader/',
    headers: {
      Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_KEY}`,
      ...data.getHeaders(),
    },
    data: data,
  });

  return response.data;
}

module.exports = {
  uploadPhoto,
};
