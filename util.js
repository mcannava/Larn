"use strict";

/*
 * generate random numbers 1<=rnd(N)<=N
 */
function rnd(value) {
  return Math.floor(Math.random() * value + 1);
}



/*
 * generate random numbers 0<=rund(N)<=N-1
 */
function rund(value) {
  return Math.floor(Math.random() * value);
}



function beep() {
  // TODO
}



function initGrid(width, height) {
  var grid = new Array(width);
  for (var x = 0; x < width; x++) {
    grid[x] = new Array(height);
    grid[x] = new Array(height);
  }
  return grid;
}



function debug(text) {
  if (DEBUG_OUTPUT) {
    console.log(`DEBUG: ${text}`);
    //updateLog(`DEBUG: ${text}`);
  }
}



var KEYBOARD_INPUT = "";



function prepare_direction_event(direction_event) {
  setCharCallback(getdirectioninput);
  keyboard_input_callback = direction_event;
  updateLog("  In what direction? ");
}




function getdirectioninput(key, code) {
  //debug(`getdirectioninput: ${key} ${code}`);
  if (key == ESC) {
    appendLog(" cancelled");
    nomove = 1;
    keyboard_input_callback = null;
    return 1;
  }
  var direction = parseDirectionKeys(key, code);
  if (direction == 0) {
    return 0;
  }
  //debug(`getdirectioninput: ${direction}`);
  if (keyboard_input_callback) {
    //debug(`getdirectioninput: ${keyboard_input_callback.name}`);
    keyboard_input_callback(direction);
  }
  keyboard_input_callback = null;
  return 1;
}



function echo(key) {
  if (!mazeMode) {
    lprc(key);
  } else {
    appendLog(key);
  }
}



function getTextInput(key) {
  var match = function(key) {
    //return isalpha(key) || isnum(key);
    return isextra(key);
  }
  return getInput(key, match);
}



function getNumberInput(key) {
  var match = function(key) {
    //return isalpha(key) || isnum(key);
    return isnum(key);
  }
  return getInput(key, match);
}



function getNumberOrAsterisk(key) {
  var match = function(key) {
    return isnum(key);
  }
  var extra = function(key) {
    if (key == '*' && KEYBOARD_INPUT.length == 0) { // only if it's the first char
      KEYBOARD_INPUT = key;
      echo(key);
      return getInput_done();
    } else {
      return 0;
    }
  }
  return getInput(key, match, extra);
}



function getInput(key, match, extra) {
  if (key == ESC) {
    KEYBOARD_INPUT = key;
    return getInput_done();
  }
  if (key == ENTER) {
    return getInput_done();
  }
  if (key == DEL) {
    if (KEYBOARD_INPUT.length > 0) {
      KEYBOARD_INPUT = KEYBOARD_INPUT.slice(0, -1);
      echo(`\b`);
    }
    return 0;
  }
  if (match(key)) {
    KEYBOARD_INPUT += key;
    echo(key);
    return 0;
  }
  if (extra) {
    return extra(key);
  }
}



function getInput_done() {
  var done = 0;
  if (keyboard_input_callback) {
    done = keyboard_input_callback(KEYBOARD_INPUT);
    if (done == 1) {
      keyboard_input_callback = null;
    }
  }
  KEYBOARD_INPUT = "";
  return done;
}



String.prototype.nextChar = function(i) {
  var n = (i == null) ? 1 : i;
  return String.fromCharCode(this.charCodeAt(0) + n);
}



String.prototype.prevChar = function(i) {
  var n = (i == null) ? 1 : i;
  return String.fromCharCode(this.charCodeAt(0) - n);
}



function getCharFromIndex(i) {
  return 'a'.nextChar(i);
}



function getIndexFromChar(char) {
  if (char == ESC) {
    return -1;
  }
  if (!isalpha(char)) {
    return -1;
  }
  var acode = "a".charCodeAt(0);
  var dropcode = char.charCodeAt(0);
  var dropIndex = dropcode - acode;
  return dropIndex;
}



function elapsedtime() {
  return Math.floor(gtime / 100);
}



function timeleft() {
  return Math.floor((TIMELIMIT - gtime) / 100);
}



function isalpha(str) {
  str = String(str);
  return str.length == 1 && str.match(/^[A-Za-z]+$/);
}



function isextra(str) {
  str = String(str);
  return str.length == 1; // allow anything?
}



function isnum(str) {
  str = String(str);
  return str.length == 1 && str.match(/^[0-9]+$/);
}



Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}



Storage.prototype.getObject = function(key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
}



function pad(str, width, bold) {
  return padString("" + str, width, bold);
}



const BOLDDELAY = 700; // left align with -width, otherwise right align
function padString(str, width, lastBoldTime) {
  if (!width || width == 0) return str;
  var now = millis();
  var numspaces = Math.max(0, Math.abs(width) + 1 - str.length);
  var spaces = Array(numspaces).join(" ");
  var boldStart = ((now - lastBoldTime) < BOLDDELAY) ? `<mark>` : ``;
  var boldEnd = ((now - lastBoldTime) < BOLDDELAY) ? `</mark>` : ``;
  if (width < 0) {
    return `${boldStart}${str}${boldEnd}${spaces}`;
  } else {
    return `${spaces}${boldStart}${str}${boldEnd}`;
  }
}



function millis() {
  return new Date().getTime();
}
