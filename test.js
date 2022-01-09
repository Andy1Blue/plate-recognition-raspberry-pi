const ButtonLed = require('./modules/buttonLed');
const Camera = require('./modules/camera');
const Display = require('./modules/display');
const OpenAlpr = require('./apps/openAlpr');
const plateRecognizer = require('./http/plateRecognizer');

const buttonLed = new ButtonLed();
const camera = new Camera();
const display = new Display();
const openAlpr = new OpenAlpr();

buttonLed.watchButton(async function () {
  const appTitle = '# Plate reco #';

  buttonLed.lightLed(1);
  display.setText(`${appTitle}\n-- Hello --`);

  let filePath;
  try {
    display.setText(`${appTitle}\nTaking photo...`);
    filePath = await camera.takePhoto(undefined, true);
  } catch (error) {
    display.setText(`${appTitle}\nTaking photo ERROR!`);
  }

  if (filePath) {
    let result = 'No result';
    let openAlprResults = [];
    try {
      display.setText(`${appTitle}\nOpenAlpr analyzing`);
      const openAlprResult = await openAlpr.checkPhoto(filePath);

      if (openAlprResult) {
        openAlprResults = openAlprResult.results;
      }
    } catch {
      display.setText(`${appTitle}\nOpenAlpr ERROR!`);
    }

    console.log({ openAlprResults });

    if (openAlprResults.length === 0) {
      try {
        display.setText(`${appTitle}\nUploading photo...`);
        const response = await plateRecognizer.uploadPhoto(filePath);

        if (response) {
          const plateRecognizerResults = response.results;

          console.log({ plateRecognizerResults });

          result = response.results[0].plate;
        }
      } catch (error) {
        display.setText(`${appTitle}\nUploading ERROR!`);
      }
    }

    display.setText(`${appTitle}\n${result}`);
  }
});
