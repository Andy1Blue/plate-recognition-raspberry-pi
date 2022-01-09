const { exec } = require('child_process');

const DIR = './photos/';
const EXTENSION = '.jpg';

const logPrefix = '[Camera]';

module.exports = class Camera {
  constructor() {}

  takePhoto(fileName = Date.now(), rotate = false) {
    const path = `${DIR}${fileName}${EXTENSION}`;

    return new Promise((resolve, reject) => {
      exec(`libcamera-still -t 0 -e jpg -r -n ${rotate && '--rotation 180'} -o ${path}`, (error, stdout, stderr) => {
        // libcamera-still can throw false negative errors
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
