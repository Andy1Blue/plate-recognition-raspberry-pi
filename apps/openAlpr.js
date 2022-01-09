const { exec } = require('child_process');

const logPrefix = '[openAlpr]';

module.exports = class OpenAlpr {
  constructor() {}

  checkPhoto(path) {
    return new Promise((resolve, reject) => {
      exec(
        `alpr -j ${path}`,
        (error, stdout, stderr) => {
          if (error) {
            console.log({ error }, `${logPrefix} Problem while checking with Alpr`);
            reject(stderr);
          }

          console.log({ stdout, stderr }, `${logPrefix} Photo checked by Alpr`);
          resolve(JSON.parse(stdout));
        }
      );
    });
  }
};
