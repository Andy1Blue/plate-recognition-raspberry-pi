const ButtonLed = require('./modules/buttonLed');
const Camera = require('./modules/camera');
const Display = require('./modules/display');
const { uploadPhoto } = require('./http/plateRecognizer');

const buttonLed = new ButtonLed();
const camera = new Camera();
const display = new Display();

buttonLed.watchButton(async function () {
  buttonLed.lightLed(1);
  display.setText('-- Hello --\n# Plate reco #');

  const fileName = await camera.takePhoto();

  display.setText('# Plate reco #\nTaking photo...');

  if (fileName) {
    const response = await uploadPhoto(`./photos/${fileName}`);

    display.setText('# Plate reco #\nUploading photo...');

    if (response) {
      console.log({ response });
      display.setText(`# Plate reco #\n${response}`);
    }
  }
});
