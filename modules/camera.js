const { exec } = require('child_process');

const DIR = '../photos/';
const EXTENSION = '.jpg';

module.exports = class Camera {
  constructor() {}

  takePhoto(fileName = Date.now()) {
    return new Promise((resolve, reject) => {
      exec(`libcamera-jpeg -o ${DIR}${fileName}${EXTENSION}`, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        }

        console.log({ stdout, stderr });
        resolve(`${fileName}${EXTENSION}`);
      });
    });
  }
};
