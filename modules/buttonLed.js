const Gpio = require('onoff').Gpio;
const LED = new Gpio(16, 'out');
const pushButton = new Gpio(17, 'in', 'both');
const sleep = require('sleep');

const logPrefix = '[ButtonLed]';

function unexportOnClose() {
  LED.writeSync(0);
  LED.unexport();
  pushButton.unexport();
  console.log('closing');
}

module.exports = class ButtonLed {
  constructor() {
    process.on('SIGINT', unexportOnClose); // function to run when close using ctrl+c
  }

  watchButton(callback) {
    pushButton.watch(function (error, value) {
      if (error) {
        console.log({ error }, `${logPrefix} Problem while init button`);

        return;
      }

      callback(value);
    });
  }

  lightLed(timeInSec) {
    LED.writeSync(1);
    sleep.sleep(timeInSec);
    LED.writeSync(0);
  }
};
