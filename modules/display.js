const i2c = require('i2c-bus');
const sleep = require('sleep');
const GrovePi = require('node-grovepi').GrovePi;
const Board = GrovePi.board;
const DISPLAY_TEXT_ADDR = 0x3e;

const logPrefix = '[Display]';

function textCommand(i2c1, cmd) {
  i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
}

module.exports = class Display {
  constructor() {
    var board = new Board({
      debug: true,
      onError: function (error) {
        console.log({ error }, `${logPrefix} Something wrong just happened`);
      },
      onInit: function (res) {
        if (res) {
          console.log(`${logPrefix} Successfully initiating`);
        }
      },
    });
    board.init();
  }

  setText(text) {
    var i2c1 = i2c.openSync(1);

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

    i2c1.closeSync();
  }
};
