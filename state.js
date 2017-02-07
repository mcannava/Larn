'use strict';

// TODO, make this the canonical source for data?
// i.e. replace cheat = ... with status.cheat etc.


/* additions for JS Larn */
var LEVELS = new Array(MAXLEVEL + MAXVLEVEL);
var LOG;
var player;
var playerID;
var NOCOOKIES = false;
var PARAMS = {};

var newsphereflag = false; /* JRP hack to not move sphere twice after cast */
var GAMEOVER = true;
var mazeMode = false;
var napping = false; /* prevent keyboard input while a nap event is happening */
var original_objects = true;
var dnd_item = null;
var genocide = [];
var amiga_mode = false;
var gameID = Math.random().toString(36).substr(2, 8);
var debug_used = 0;

var logname = `Adventurer`;
var cheat = 0; /* 1 if the player has fudged save file */
var level = 0; /* cavelevel player is on = cdesc[CAVELEVEL] */
var wizard = 0; /* the wizard mode flag */
var gtime = -1; /* the clock for the game */
var HARDGAME = 0; /* game difficulty */

/* these function were added as a defensive measure to find a pesky bug,
   and now it's easier to just leave them here
*/
function getDifficulty() {
  if (HARDGAME == null || HARDGAME === `` || isNaN(Number(HARDGAME))) {
    console.log('get: invalid difficulty: ' + HARDGAME);
    console.trace();
  }
  return HARDGAME;
}

function setDifficulty(diff) {
  if (diff == null || diff === `` || isNaN(Number(diff))) {
    console.log('set: invalid difficulty: ' + diff);
    console.trace();
  }
  HARDGAME = diff;
}

var lastmonst = ``; /* name of the last monster to hit the player */
var lastnum = 0; /* the number of the monster last hitting player */
var hitflag = 0; /* flag for if player has been hit when running */
var lastpx = 0;
var lastpy = 0;
var lasthx = 0; /* location of monster last hit by player */
var lasthy = 0; /* location of monster last hit by player */
var prayed = 1; /* did player pray at an altar?  */
var course = []; /* the list of courses taken */
var outstanding_taxes = 0; /* present tax bill from score file */
var dropflag = 0; /* if 1 then don't lookforobject() next round */
var rmst = 120; /* random monster creation counter */
var nomove = 0; /* if (nomove) then don't count next iteration as a move */
var viewflag = 0; /* if viewflag then we have done a 99 stay here and don't showcell in the main loop */
var lasttime = 0; /* last time in bank */
var w1x;
var w1y;
var spheres = [];
var auto_pickup = false;



function GameState() {
  this.LEVELS = LEVELS;
  this.LOG = LOG;
  this.player = player;

  this.newsphereflag = newsphereflag;
  this.GAMEOVER = GAMEOVER;
  this.mazeMode = mazeMode;
  this.napping = napping;
  this.original_objects = original_objects;
  this.dnd_item = dnd_item;
  this.genocide = genocide;
  this.amiga_mode = amiga_mode;
  this.gameID = gameID;
  this.debug_used = debug_used;

  this.logname = logname;
  this.cheat = cheat;
  this.level = level;
  this.wizard = wizard;
  this.gtime = gtime;
  this.HARDGAME = getDifficulty();
  this.lastmonst = lastmonst;
  this.lastnum = lastnum;
  this.hitflag = hitflag;
  this.lastpx = lastpx;
  this.lastpy = lastpy;
  this.lasthx = lasthx;
  this.lasthy = lasthy;
  this.prayed = prayed;
  this.course = course;
  this.outstanding_taxes = outstanding_taxes;
  this.dropflag = dropflag;
  this.rmst = rmst;
  this.nomove = nomove;
  this.viewflag = viewflag;
  this.lasttime = lasttime;
  this.w1x = w1x;
  this.w1y = w1y;
  this.spheres = spheres;
  this.auto_pickup = auto_pickup;
}
