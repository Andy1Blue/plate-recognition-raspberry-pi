require('dotenv').config()

const Camera = require('./modules/camera');

const camera = new Camera();

var Gpio = require('onoff').Gpio;
var LED = new Gpio(16, 'out');
var pushButton = new Gpio(17, 'in', 'both');
var sleep = require('./node_modules/sleep/');
const { exec } = require('child_process');
var i2c = require('./node_modules/i2c-bus/i2c-bus');
var GrovePi = require('node-grovepi').GrovePi;
var fs = require('fs');
var axios = require('axios');
var FormData = require('form-data');
var Board = GrovePi.board;

var DISPLAY_TEXT_ADDR = 0x3e;GrovePi

function textCommand(i2c1, cmd) {
  i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
}

function setText(i2c1, text) {
  textCommand(i2c1, 0x01);
  sleep.usleep(50000);
  textCommand(i2c1, 0x08 | 0x04);
  textCommand(i2c1, 0x28);
  sleep.usleep(50000);
  var count = 0;
  var row = 0;

  for (var i = 0, len = text.length; i < len; i++) {
    if (text[i] === '\n' || count === 16) {
      count = 0;
      row++;
      if (row === 2) break;
      textCommand(i2c1, 0xc0);
      if (text[i] === '\n') continue;
    }

    count++;
    i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x40, text[i].charCodeAt(0));
  }
}

function identify({ path, image }) {
  // exec(`alpr -c eu ${path}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.log(`##1 stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`##FINISHED stdout: ${stdout}`); ///

  //   const a = stdout.split('\n');

  //   var i2c1 = i2c.openSync(1);
  //   setText(i2c1, `${a[1]}\n${a[2]}`);
  //   i2c1.closeSync();
  // });

  // axios

  var data = new FormData();
  data.append('upload', fs.createReadStream(path));
  data.append('regions', 'pl');
  console.log(process.env.PLATE_RECOGNIZER_API_KEY, fs.createReadStream(path));
  var config = {
    method: 'post',
    url: 'https://api.platerecognizer.com/v1/plate-reader/',
    headers: {
      Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_KEY}`,
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

pushButton.watch(function (err, value) {
  if (err) {
    console.error('There was an error', err);
    return;
  }

  console.log('Button pushed');

  var board = new Board({
    debug: true,
    onError: function (err) {
      console.log('Something wrong just happened');
      console.log(err);
    },
    onInit: function (res) {
      if (res) {
        console.log('GrovePi Version :: ' + board.version());

        var i2c1 = i2c.openSync(1);
        setText(i2c1, 'PLATE\nHello');
        i2c1.closeSync();
      }
    },
  });
  board.init();

  if (value === 1) {
    LED.writeSync(1);

    exec('libcamera-jpeg -o test.jpg', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      console.log(`Photo taken ${stdout}`);

      LED.writeSync(0);

      var i2c1 = i2c.openSync(1);
      setText(i2c1, 'PLATE\nPhoto taken');
      i2c1.closeSync();

      var image = fs.createReadStream('./test.jpg');

      identify({ image, path: 'test.jpg' });
    });
  }
});

function unexportOnClose() {
  LED.writeSync(0);
  LED.unexport();
  pushButton.unexport();
}

process.on('SIGINT', unexportOnClose);
