const { exec } = require('child_process');

const logPrefix = '[openAlpr]';

module.exports = class OpenAlpr {
  constructor() {}

  checkPhoto(path, country = 'eu') {
    const path = `${DIR}${fileName}${EXTENSION}`;

    return new Promise((resolve, reject) => {
      exec(
        `alpr -c ${country} ${path}`,
        (error, stdout, stderr) => {
          if (error) {
            console.log({ error }, `${logPrefix} Problem while checking with Alpr`);
            reject(stderr);
          }

          console.log({ stdout, stderr }, `${logPrefix} Photo checked by Alpr`);
          resolve(stdout);
        }
      );
    });
  }
};
