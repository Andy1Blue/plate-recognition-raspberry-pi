const Raspistill = require('node-raspistill').Raspistill;
// const camera = new Raspistill({
//     verticalFlip: true,
//     width: 800,
//     height: 600
// });

// camera.takePhoto('test.jpg');

const raspistill = new Raspistill();

raspistill.takePhoto()
    .then((photo) => {
        console.log('took photo', photo);
    })
    .catch((error) => {
        console.error('something bad happened', error);
    });

// const camera = new Raspistill();

// camera.takePhoto().then((photo) => {
//     ...
// });