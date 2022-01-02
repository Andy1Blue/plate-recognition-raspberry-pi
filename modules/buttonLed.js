var Gpio = require('onoff').Gpio;
var LED = new Gpio(16, 'out');
var pushButton = new Gpio(17, 'in', 'both');
var sleep = require('sleep');

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

  lightLed() {
    LED.writeSync(1);
    sleep.sleep(1);
    LED.writeSync(0);
  }
};
