// const Raspistill = require('node-raspistill').Raspistill;
// // const camera = new Raspistill({
// //     verticalFlip: true,
// //     width: 800,
// //     height: 600
// // });

// // camera.takePhoto('test.jpg');

// const raspistill = new Raspistill();

// raspistill.takePhoto()
//     .then((photo) => {
//         console.log('took photo', photo);
//     })
//     .catch((error) => {
//         console.error('something bad happened', error);
//     });

// // const camera = new Raspistill();

// // camera.takePhoto().then((photo) => {
// //     ...
// // });

const raspberryPiCamera = require('raspberry-pi-camera-native');
// add frame data event listener
raspberryPiCamera.on('frame', (frameData) => {
    // frameData is a Node.js Buffer
    // ...
    console.log({frameData})
  });
  
  // start capture
  raspberryPiCamera.start({  width: 1280,
    height: 720,
    fps: 30,
    quality: 80,
    encoding: 'JPEG'});