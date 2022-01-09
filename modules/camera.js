const { exec } = require('child_process');

const DIR = './photos/';
const EXTENSION = '.jpg';

const logPrefix = '[Camera]';

module.exports = class Camera {
  constructor() {}

  takePhoto(fileName = Date.now()) {
    const path = `${DIR}${fileName}${EXTENSION}`;

    return new Promise((resolve, reject) => {
      exec(`libcamera-still --nopreview -o ${path}`, (error, stdout, stderr) => {
        if (error) {
          console.log({ error }, `${logPrefix} Problem while taking photo`);
          reject(stderr);
        }

        console.log({ stdout, stderr }, `${logPrefix} Photo was taken`);
        resolve(path);
      });
    });
  }
};
