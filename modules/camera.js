const { exec } = require('child_process');

const DIR = './photos/';
const EXTENSION = '.jpg';

const logPrefix = '[Camera]';

module.exports = class Camera {
  constructor() {}

  takePhoto(fileName = Date.now()) {
    const path = `${DIR}${fileName}${EXTENSION}`;

    return new Promise((resolve, reject) => {
      exec(
        `libcamera-still -r --n -o ${path} -t 100 --analoggain 1 --sharpness 0 --contrast 0 --brightness 0 --saturation`,
        (error, stdout, stderr) => {
          if (error) {
            console.log({ error }, `${logPrefix} Problem while taking photo`);
            reject(stderr);
          }

          console.log({ stdout, stderr }, `${logPrefix} Photo was taken`);
          resolve(path);
        }
      );
    });
  }
};
