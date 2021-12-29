const Raspistill = require('node-raspistill');
const camera = new Raspistill({
    verticalFlip: true,
    width: 800,
    height: 600
});

camera.takePhoto('test.jpg');

// const camera = new Raspistill();

// camera.takePhoto().then((photo) => {
//     ...
// });