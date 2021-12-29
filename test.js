var Gpio = require('onoff').Gpio;
var LED = new Gpio(16, 'out');
var pushButton = new Gpio(17, 'in', 'both');
var sleep = require("./node_modules/sleep/");
const Raspistill = require('node-raspistill').Raspistill;

pushButton.watch(function (err, value) {
  if (err) {
    console.error('There was an error', err);
  return;
  }

  console.log('Button pushed')


  if (value === 1) {
    LED.writeSync(1);
  }

});

function unexportOnClose() {
  LED.writeSync(0);
  LED.unexport();
  pushButton.unexport();
};

process.on('SIGINT', unexportOnClose);