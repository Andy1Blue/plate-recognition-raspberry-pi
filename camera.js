const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'photo',
  output: `photos/test.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});

myCamera.snap()
  .then((result) => {
    console.log({result});
  })
  .catch((error) => {
    console.log({error});
  });