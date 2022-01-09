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

  let filePath;
  try {
    display.setText('# Plate reco #\nTaking photo...');
    filePath = await camera.takePhoto();
  } catch (error) {
    console.log({ error });
    display.setText('# Plate reco #\nTaking photo ERROR!');
  }

  if (filePath) {
    try {
      const response = await uploadPhoto(filePath);

      display.setText('# Plate reco #\nUploading photo...');

      if (response) {
        console.log({ response });
        display.setText(`# Plate reco #\n${response}`);
      }
    } catch (error) {
      console.log({ error });
      display.setText('# Plate reco #\nUploading ERROR!');
    }
  }
});
