const ButtonLed = require('./modules/buttonLed');
const Camera = require('./modules/camera');
const Display = require('./modules/display');
const { uploadPhoto } = require('./http/plateRecognizer');

const buttonLed = new ButtonLed();
const camera = new Camera();
const display = new Display();

buttonLed.watchButton(async function () {
  const appTitle = '# Plate reco #';

  buttonLed.lightLed(1);
  display.setText(`${appTitle}\n-- Hello --`);

  let filePath;
  try {
    display.setText(`${appTitle}\nTaking photo...`);
    filePath = await camera.takePhoto();
  } catch (error) {
    display.setText(`${appTitle}\nTaking photo ERROR!`);
  }

  if (filePath) {
    try {
      const response = await uploadPhoto(filePath);
      display.setText(`${appTitle}\nUploading photo...`);

      if (response) {
        console.log({ response });
        display.setText(`${appTitle}\n${response}`);
      }
    } catch (error) {
      display.setText(`${appTitle}\nUploading ERROR!`);
    }
  }
});
