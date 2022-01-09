const ButtonLed = require('./modules/buttonLed');
const Camera = require('./modules/camera');
const Display = require('./modules/display');
const OpenAlpr = require('./apps/openAlpr');
const { uploadPhoto } = require('./http/plateRecognizer');

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

    return;
  }

  if (filePath) {
    try {
       const openAlprResult = await openAlpr.checkPhoto(filePath);

       console.log({openAlprResult})
    } catch {
        display.setText(`${appTitle}\nOpenAlpr ERROR!`);
    }

    // try {
    //   const response = await uploadPhoto(filePath);
    //   display.setText(`${appTitle}\nUploading photo...`);

    //   if (response) {
    //     console.log({ response });
    //     display.setText(`${appTitle}\n${response}`);
    //   }
    // } catch (error) {
    //   display.setText(`${appTitle}\nUploading ERROR!`);

    //   return;
    // }
  }
});
