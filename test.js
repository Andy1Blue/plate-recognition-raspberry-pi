const ButtonLed = require('./modules/buttonLed');
const Camera = require('./modules/camera');
const Display = require('./modules/display');

const buttonLed = new ButtonLed();
const camera = new Camera();
const display = new Display();

buttonLed.watchButton(function () {
  display.setText('hello');
});
