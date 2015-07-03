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
  debug("TODO: BEEP");
}


function xy(x,y) {
    return "(" + x + "," + y + ")";
}


function debug(text) {
  if (DEBUG_OUTPUT) {
    console.log("DEBUG: " + text);
    updateLog("DEBUG: " + text);
  }
}