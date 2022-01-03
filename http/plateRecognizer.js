require('dotenv').config();

function uploadPhoto(path) {
  var data = new FormData();
  data.append('upload', fs.createReadStream(path));
  data.append('regions', 'pl');

  var config = {
    method: 'post',
    url: 'https://api.platerecognizer.com/v1/plate-reader/',
    headers: {
      Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_KEY}`,
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = {
  uploadPhoto,
};
