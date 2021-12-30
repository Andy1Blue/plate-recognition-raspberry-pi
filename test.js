var Gpio = require('onoff').Gpio;
var LED = new Gpio(16, 'out');
var pushButton = new Gpio(17, 'in', 'both');
var sleep = require('./node_modules/sleep/');
const { exec } = require('child_process');
var i2c = require('./node_modules/i2c-bus/i2c-bus');
var sleep = require('./node_modules/sleep/');
var GrovePi = require('node-grovepi').GrovePi;

var Board = GrovePi.board;

var DISPLAY_RGB_ADDR = 0x62;
var DISPLAY_TEXT_ADDR = 0x3e;

function setRGB(i2c1, r, g, b) {
  i2c1.writeByteSync(DISPLAY_RGB_ADDR, 0, 0);
  i2c1.writeByteSync(DISPLAY_RGB_ADDR, 1, 0);
  i2c1.writeByteSync(DISPLAY_RGB_ADDR, 0x08, 0xaa);
  i2c1.writeByteSync(DISPLAY_RGB_ADDR, 4, r);
  i2c1.writeByteSync(DISPLAY_RGB_ADDR, 3, g);
  i2c1.writeByteSync(DISPLAY_RGB_ADDR, 2, b);
}

function textCommand(i2c1, cmd) {
  i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
}

function setText(i2c1, text) {
  textCommand(i2c1, 0x01); // clear display
  sleep.usleep(50000);
  textCommand(i2c1, 0x08 | 0x04); // display on, no cursor
  textCommand(i2c1, 0x28); // 2 lines
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

function identify(id, path) {
  exec('alpr -c us ea7the.jpg', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`##1 stderr: ${stderr}`);
      return;
    }
    console.log(`##FINISHED stdout: ${stdout}`); ///

    const a = stdout.split('\n');

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
          setText(i2c1, `${a[1]}\n${a[2]}`);
          i2c1.closeSync();
        }
      },
    });
    board.init();
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
        setText(i2c1, 'PLATE\nHELLO');
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
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    LED.writeSync(0);

    identify(0, 'test.jpg');
  }
});

function unexportOnClose() {
  LED.writeSync(0);
  LED.unexport();
  pushButton.unexport();
}

process.on('SIGINT', unexportOnClose);
