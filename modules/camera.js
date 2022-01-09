const { exec } = require('child_process');

const DIR = './photos/';
const EXTENSION = '.jpg';

module.exports = class Camera {
  constructor() {}

  takePhoto(fileName = Date.now()) {
    const path = `${DIR}${fileName}${EXTENSION}`;

    return new Promise((resolve, reject) => {
      exec(`libcamera-jpeg -o ${path}`, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        }

        console.log({ stdout, stderr });
        resolve(path);
      });
    });
  }
};
