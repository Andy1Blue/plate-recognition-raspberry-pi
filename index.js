const ButtonLed = require('./modules/buttonLed');
const Camera = require('./modules/camera');
const Display = require('./modules/display');
const OpenAlpr = require('./apps/openAlpr');

const plateRecognizer = require('./http/plateRecognizer');

const buttonLed = new ButtonLed();
const camera = new Camera();
const display = new Display();
const openAlpr = new OpenAlpr();

const appTitle = '# Plate reco #';

async function takePhoto() {
  display.setText(`${appTitle}\nTaking photo...`);
  const filePath = '';

  try {
    filePath = await camera.takePhoto(undefined, true);
  } catch (error) {
    display.setText(`${appTitle}\nTaking photo ERROR!`);
  }

  return filePath;
}

async function openAlprCheckPhoto() {
  display.setText(`${appTitle}\nOpenAlpr analyzing`);
  let openAlprResults = [];

  try {
    const openAlprResult = await openAlpr.checkPhoto(filePath);

    if (openAlprResult) {
      openAlprResults = openAlprResult.results;
    }
  } catch {
    display.setText(`${appTitle}\nOpenAlpr ERROR!`);
  }

  return openAlprResults;
}

async function plateRecognizerCheckPhoto() {
  display.setText(`${appTitle}\nUploading photo...`);
  let result = '';

  try {
    const response = await plateRecognizer.uploadPhoto(filePath);

    if (response) {
      const plateRecognizerResults = response.results;

      console.log({ plateRecognizerResults });

      result = response.results[0].plate;
    }
  } catch (error) {
    display.setText(`${appTitle}\nUploading ERROR!`);
  }

  return result;
}

buttonLed.watchButton(async function () {
  buttonLed.lightLed(1);
  display.setText(`${appTitle}\n-- Hello --`);

  const filePath = await takePhoto();

  if (filePath) {
    let result = 'No result';
    const openAlprResults = await openAlprCheckPhoto();

    console.log({ openAlprResults });

    if (openAlprResults.length === 0) {
      result = await plateRecognizerCheckPhoto();
    }

    display.setText(`${appTitle}\n${result}`);
  }
});
