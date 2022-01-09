const ButtonLed = require('./modules/buttonLed');
const Camera = require('./modules/camera');
const Display = require('./modules/display');
const { uploadPhoto } = require('./http/plateRecognizer');

const buttonLed = new ButtonLed();
const camera = new Camera();
const display = new Display();

buttonLed.watchButton(async function () {
  display.setText('-- Hello --\n# Plate reco #');
  buttonLed.lightLed(3);
  buttonLed.lightLed(3);
  buttonLed.lightLed(3);

  const filePath = await camera.takePhoto();

  display.setText('# Plate reco #\nTaking photo...');

  if (filePath) {
    const response = await uploadPhoto(filePath);

    display.setText('# Plate reco #\nUploading photo...');

    if (response) {
      console.log({ response });
      display.setText(`# Plate reco #\n${response}`);
    }
  }
});
