const Gpio = require('onoff').Gpio;
const LED = new Gpio(16, 'out');
const pushButton = new Gpio(17, 'in', 'both');
const sleep = require('sleep');

function unexportOnClose() {
  LED.writeSync(0);
  LED.unexport();
  pushButton.unexport();
}

module.exports = class ButtonLed {
  constructor() {
    process.on('SIGINT', unexportOnClose); // function to run when close using ctrl+c
  }

  watchButton(callback) {
    pushButton.watch(function (err, value) {
      if (err) {
        console.error('There was an error', err);
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
