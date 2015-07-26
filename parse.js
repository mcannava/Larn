"use strict";

var wait_for_drop_input = false;
var wait_for_open_direction = false;

const ESC = 27;
const ENTER = 13;
const SPACE = 32;
const DEL_CODE = 8;
const DEL = "___DELETE___";


function preParseEvent(e, keyDown, keyUp) {
  var code = e.which;
  //debug(`preParseEvent(): got: ${code}: ${keyDown} ${keyUp} ${e.key}`);
  if (keyDown) { // to capture ESC key etc
    if (code == ESC || code == ENTER || code == DEL_CODE || code == SPACE || code >= 37 && code <= 40) {
      e.preventDefault(); // prevent scrolling on page
      parseEvent(e);
    } else {
      //debug("preParseEvent.keydown(): ignoring: " + code);
    }
  } else if (keyUp) {
    //debug("preParseEvent.keyup(): ignoring: " + code);
  } else {
    if (code < 37 || code > 40) {
      parseEvent(e);
    } else {
      debug("preParseEvent.keypress(): ignoring: " + code);
    }
  }
}

var blocking_callback;
var non_blocking_callback;
var keyboard_input_callback;


function parseEvent(e) {

  var code = e.which;
  var key = String.fromCharCode(code);

  if (e.which == undefined) {
    key = e;
  }

  nomove = 0;

  // if (blocking_callback != null)
  // debug("blocking: " + blocking_callback.name);
  // if (non_blocking_callback != null)
  // debug("non_blocking: " + non_blocking_callback.name);
  // if (keyboard_input_callback != null)
  // debug("keyboard_input_callback: " + keyboard_input_callback.name);

  // debug(`parseEvent(): got: ${code}: ${key}`);

  if (code == ENTER) {
    key = ENTER;
  }
  if (code == DEL_CODE) {
    key = DEL;
  }

  var newx = player.x;
  var newy = player.y;

  if (blocking_callback != null) {
    //debug(blocking_callback.name + ": ");
    var before = blocking_callback.name;
    let done = blocking_callback(code == ESC ? ESC : key, code);
    var after = blocking_callback.name;
    player.level.paint();
    //debug(blocking_callback.name + ": " + done);

    // if a blocking callback assigns a new one, we're not done yet
    // i think i have created my own special callback hell
    if (before == after && done) {
      blocking_callback = null;
    }
    return;
  }

  if (non_blocking_callback != null) {
    non_blocking_callback(code == ESC ? ESC : key, code);
    non_blocking_callback = null;
    player.level.paint();
  }




  if (IN_STORE) {
    debug("IN STORE");
    return;
  }



  var item = getItem(player.x, player.y);




  if (wait_for_drop_input) {
    drop_object(code == ESC ? ESC : key);
    return;
  }
  if (wait_for_open_direction) {
    open_something(parseDirectionKeys(key, code));
    return;
  }

  //
  // DROP
  //
  if (key == 'd') {
    drop_object(null);
    return;
  }



  //
  // DRINK FROM FOUNTAIN
  //
  if (key == 'D') {
    drink_fountain(null);
    return;
  }



  //
  // WASH AT FOUNTAIN
  //
  if (key == 'T') {
    wash_fountain(null);
    return;
  }



  //
  // PICK UP
  //
  if (key == 't') {
    if (take(item)) {
      forget(); // remove from board
    }
    return;
  }



  //
  // CAST A SPELL
  //
  if (key == 'c') {
    pre_cast();
    return;
  }



  //
  // read
  //
  if (key == 'r') {
    if (player.BLINDCOUNT > 0) {
      cursors();
      updateLog("You can't read anything when you're blind!");
      return;
    }
    if (item.matches(OBOOK)) {
      readbook(item);
      forget();
    } else if (item.matches(OSCROLL)) {
      forget();
      read_scroll(item);
    } else {
      updateLog("What do you want to read [* for all] ?");
      blocking_callback = act_read_something; // TODO this should fall through
    }
    //return;
  }



  //
  // quaff
  //
  if (key == 'q') {
    if (item.matches(OPOTION)) {
      forget();
      quaffpotion(item);
    } else {
      updateLog("What do you want to quaff [* for all] ?");
      blocking_callback = act_quaffpotion; // TODO this should fall through
    }
    //return;
  }



  //
  // WIELD
  //
  if (key == 'w') {
    if (item.isWeapon()) {
      wield(item);
    } else {
      updateLog("What do you want to wield (- for nothing) [* for all] ?");
      blocking_callback = wield; // TODO this should fall through
    }
    //return;
  }



  //
  // WEAR
  //
  if (key == 'W') {
    if (item.isArmor()) {
      wear(item);
    } else {
      updateLog("What do you want to wear (- for nothing) [* for all] ?");
      blocking_callback = wear; // TODO this should fall through
    }
    //return;
  }


  //
  // TELEPORT
  //
  if (key == 'Z') {
    yrepcount = 0;
    if (player.LEVEL > 9) {
      oteleport(1);
      return;
    }
    cursors();
    lprcat("As yet, you don't have enough experience to use teleportation");
    return;
  }



  //
  // OPEN (in a direction)
  //
  if (key == 'O') {
    yrepcount = 0;
    //    if (!prompt_mode)
    open_something(null);
    // else
    //   nomove = 1;
    return;
  }



  //
  // OPEN (in a direction)
  //
  if (key == 'o') {
    yrepcount = 0;
    //    if (!prompt_mode)
    o_closed_door(null);
    // else
    //   nomove = 1;
    return;
  }


  //
  // ENTER A BUILDING
  //
  if (key == 'E') {
    yrepcount = 0;

    // if (!prompt_mode)
    enter();
    // else
    //   nomove = 1;
    return;
  }


  /*
           ARROW KEYS           NUMPAD               KEYBOARD
               ↑               7  8  9               y  k  u
               |                \ | /                 \ | /
            ←- . -→            4 -.- 6               h -.- l
               |                / | \                 / | \
               ↓               1  2  3               b  j  n
  */

  //
  // MOVE PLAYER
  //
  var dir = parseDirectionKeys(key, code);
  if (dir > 0) {
    if (e.shiftKey) {
      run(dir);
    } else {
      moveplayer(dir);
    }
  }


  //
  // UP LEVEL
  //
  else if (key == '<') { // UP STAIRS
    if (isItem(newx, newy, OSTAIRSUP)) {
      updateLog("Climbing Up Stairs");
      newcavelevel(player.level.depth - 1);
      //positionplayer(newx, newy, true);
    } else if (isItem(newx, newy, OVOLUP)) {
      updateLog("Climbing Up Volcanic Shaft");
      newcavelevel(0);
      moveNear(OVOLDOWN, false);
    } else if (DEBUG_STAIRS_EVERYWHERE) {
      if (player.level.depth == 0) {
        // do nothing
      } else if (player.level.depth == 1) {
        debug("STAIRS_EVERYWHERE: going to home level");
        newcavelevel(0);
        moveNear(OENTRANCE, false);
      } else if (player.level.depth == 11) {
        debug("STAIRS_EVERYWHERE: climbing up volcanic shaft");
        moveNear(OVOLUP, true);
        parseEvent(e);
        return;
      } else {
        debug("STAIRS_EVERYWHERE: climbing up stairs");
        moveNear(OSTAIRSUP, true);
        parseEvent(e);
        return;
      }
    } else if (isItem(newx, newy, OSTAIRSDOWN)) {
      updateLog("The stairs don't go up!");
    } else if (!isItem(newx, newy, OSTAIRSUP) || !isItem(newx, newy, OVOLUP)) {
      // we can only go up stairs, or volcanic shaft leading upward
      updateLog("I see no way to go up here!");
    }
  }

  //
  // DOWN LEVEL
  //
  else if (key == '>') { // DOWN STAIRS
    if (isItem(newx, newy, OSTAIRSDOWN)) {
      updateLog("Climbing Down Stairs");
      newcavelevel(player.level.depth + 1);
      //positionplayer(newx, newy, true);
    } else if (isItem(newx, newy, OVOLDOWN)) {
      updateLog("Climbing Down Volcanic Shaft");
      newcavelevel(11);
      //positionplayer(newx, newy, true); // should do this to make it more difficult
      moveNear(OVOLUP, false);
      debug("Moving near V -- REMOVE THIS FEATURE LATER");
    } else if (isItem(newx, newy, OENTRANCE)) {
      // updateLog("Entering Dungeon");
      // player.x = Math.floor(MAXX / 2);
      // player.y = MAXY - 2;
      // newcavelevel(1);
    } else if (DEBUG_STAIRS_EVERYWHERE) {
      if (player.level.depth == 0) {
        debug("STAIRS_EVERYWHERE: entering dungeon");
        moveNear(OENTRANCE, true);
        parseEvent('E');
        return;
      } else if (player.level.depth != 10 && player.level.depth != 13) {
        debug("STAIRS_EVERYWHERE: climbing down stairs");
        moveNear(OSTAIRSDOWN, true);
        parseEvent(e);
        return;
      }
    } else if (isItem(newx, newy, OSTAIRSUP)) {
      updateLog("The stairs don't go down!");
    } else if (!isItem(newx, newy, OSTAIRSDOWN) || !isItem(newx, newy, OVOLDOWN)) {
      updateLog("I see no way to go down here!");
    }

  } else if (key == 'g') { // GO INSIDE DUNGEON
  } else if (key == 'C' || key == 'V') { // CLIMB IN/OUT OF VOLCANO
    if (player.level.depth == 0 && DEBUG_STAIRS_EVERYWHERE) {
      debug("STAIRS_EVERYWHERE: entering volcano");
      moveNear(OVOLDOWN, true);
      parseEvent('>');
      return;
    }
  }
  //
  // DEBUGGING SHORTCUTS
  //
  if (key == 'X' || key == '~') {
    DEBUG_STATS = !DEBUG_STATS;
    updateLog("DEBUG_STATS: " + DEBUG_STATS);
  }
  if (key == 'X' || key == '!') {
    DEBUG_OUTPUT = !DEBUG_OUTPUT;
    updateLog("DEBUG_OUTPUT: " + DEBUG_OUTPUT);
  }
  if (key == 'X' || key == '@') {
    player.WTW = player.WTW == 0 ? 100000 : 0;
    updateLog("DEBUG_WALK_THROUGH_WALLS: " + (player.WTW > 0));
  }
  if (key == 'X' || key == '#') {
    DEBUG_STAIRS_EVERYWHERE = !DEBUG_STAIRS_EVERYWHERE;
    updateLog("DEBUG_STAIRS_EVERYWHERE: " + DEBUG_STAIRS_EVERYWHERE);
  }
  if (key == 'X' || key == '$') {
    DEBUG_KNOW_ALL = !DEBUG_KNOW_ALL;
    if (DEBUG_KNOW_ALL) {
      for (var potioni = 0; potioni < potionname.length; potioni++) {
        var potion = createObject(OPOTION, potioni);
        player.level.items[potioni][0] = potion;
      }
      for (var scrolli = 0; scrolli < scrollname.length; scrolli++) {
        var scroll = createObject(OSCROLL, scrolli);
        player.level.items[potioni + scrolli][0] = scroll;
      }
      var weaponi = 0;
      player.level.items[weaponi++][MAXY - 1] = createObject(ODAGGER);
      player.level.items[weaponi++][MAXY - 1] = createObject(OBELT);
      player.level.items[weaponi++][MAXY - 1] = createObject(OSPEAR);
      player.level.items[weaponi++][MAXY - 1] = createObject(OFLAIL);
      player.level.items[weaponi++][MAXY - 1] = createObject(OBATTLEAXE);
      player.level.items[weaponi++][MAXY - 1] = createObject(OLANCE);
      player.level.items[weaponi++][MAXY - 1] = createObject(OLONGSWORD);
      player.level.items[weaponi++][MAXY - 1] = createObject(O2SWORD);
      player.level.items[weaponi++][MAXY - 1] = createObject(OSWORD);
      player.level.items[weaponi++][MAXY - 1] = createObject(OSWORDofSLASHING);
      player.level.items[weaponi++][MAXY - 1] = createObject(OHAMMER);
      var armori = weaponi;
      player.level.items[armori++][MAXY - 1] = createObject(OSHIELD);
      player.level.items[armori++][MAXY - 1] = createObject(OLEATHER);
      player.level.items[armori++][MAXY - 1] = createObject(OSTUDLEATHER);
      player.level.items[armori++][MAXY - 1] = createObject(ORING);
      player.level.items[armori++][MAXY - 1] = createObject(OCHAIN);
      player.level.items[armori++][MAXY - 1] = createObject(OSPLINT);
      player.level.items[armori++][MAXY - 1] = createObject(OPLATE);
      player.level.items[armori++][MAXY - 1] = createObject(OPLATEARMOR);
      player.level.items[armori++][MAXY - 1] = createObject(OSSPLATE);

      player.level.items[armori++][MAXY - 1] = createObject(ODAMRING);
      player.level.items[armori++][MAXY - 1] = createObject(ODEXRING);
      player.level.items[armori++][MAXY - 1] = createObject(OSTRRING);
      player.level.items[armori++][MAXY - 1] = createObject(OENERGYRING);
      player.level.items[armori++][MAXY - 1] = createObject(OCLEVERRING);
      player.level.items[armori++][MAXY - 1] = createObject(OPROTRING);
      player.level.items[armori++][MAXY - 1] = createObject(OREGENRING);
      player.level.items[armori++][MAXY - 1] = createObject(ORINGOFEXTRA);

      player.level.items[armori++][MAXY - 1] = createObject(OSPIRITSCARAB);
      player.level.items[armori++][MAXY - 1] = createObject(OCUBEofUNDEAD);
      player.level.items[armori++][MAXY - 1] = createObject(ONOTHEFT);
      player.level.items[armori++][MAXY - 1] = createObject(OORBOFDRAGON);

      player.level.items[armori++][MAXY - 1] = createObject(OLARNEYE);
      player.level.items[armori++][MAXY - 1] = createObject(OEMERALD, 20);
      player.level.items[armori++][MAXY - 1] = createObject(OSAPPHIRE, 15);
      player.level.items[armori++][MAXY - 1] = createObject(ODIAMOND, 10);
      player.level.items[armori++][MAXY - 1] = createObject(ORUBY, 5);

      player.level.items[armori++][MAXY - 1] = createObject(OALTAR);
      player.level.items[armori++][MAXY - 1] = createObject(OTHRONE);
      player.level.items[armori++][MAXY - 1] = createObject(OFOUNTAIN);
      player.level.items[armori++][MAXY - 1] = createObject(OMIRROR);

    }
    updateLog("DEBUG_KNOW_ALL: " + DEBUG_KNOW_ALL);
  }
  if (key == 'X' || key == '^') {
    if (player.STEALTH <= 0) {
      updateLog("DEBUG: FREEZING MONSTERS");
      player.HOLDMONST = 100000;
      player.STEALTH = 100000;
    } else {
      updateLog("DEBUG: UNFREEZING MONSTERS");
      player.HOLDMONST = 0;
      player.STEALTH = 0;
    }
  }
  if (key == 'X') {
    player.WEAR = null;
    player.inventory[0] = createObject(OLANCE, 25);
    player.WIELD = player.inventory[0];
    player.inventory[1] = createObject(OPROTRING, 50);
    player.STEALTH = 0;
    player.GOLD = 250000;
    player.STRENGTH = 70;
    player.INTELLIGENCE = 70;
    player.WISDOM = 70;
    player.CONSTITUTION = 70;
    player.DEXTERITY = 70;
    player.CHARISMA = 70;
    player.raiseexperience(6000000 - player.EXPERIENCE);

    for (var i = 0; i < spelcode.length; i++) {
      learnSpell(spelcode[i]);
    }

  }

  hitflag = 0;

  if (prompt_mode)
    lookforobject(true, false, true);
  //else
  //lookforobject( true, ( auto_pickup && !move_no_pickup ), false);
  //else
  //dropflag=0; /* don't show it just dropped an item */


  if (nomove == 0) {
    movemonst();
  }
  gtime++; // TODO
  player.level.paint();

} // KEYPRESS



//const diroffx = { 0,  0, 1,  0, -1,  1, -1, 1, -1 };
//const diroffy = { 0,  1, 0, -1,  0, -1, -1, 1,  1 };

function parseDirectionKeys(key, code) {
  var dir = 0;
  if (key == 'y' || key == 'Y' || code == 55) { // UP,LEFT
    dir = 6;
  } else if (key == 'k' || key == 'K' || code == 56 || code == 38) { // NORTH
    dir = 3;
  } else if (key == 'u' || key == 'U' || code == 57) { // UP,RIGHT
    dir = 5;
  } else if (key == 'h' || key == 'H' || code == 52 || code == 37) { // LEFT
    dir = 4;
  } else if (key == 'l' || key == 'L' || code == 54 || code == 39) { // RIGHT
    dir = 2;
  } else if (key == 'b' || key == 'B' || code == 49) { // DOWN,LEFT
    dir = 8;
  } else if (key == 'j' || key == 'J' || code == 50 || code == 40) { // DOWN
    dir = 1;
  } else if (key == 'n' || key == 'N' || code == 51) { // DOWN, RIGHT
    dir = 7;
  }
  return dir;

}
