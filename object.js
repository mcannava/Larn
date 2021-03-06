'use strict';

const itemlist = [];

const hack_objnamelist = `·:\\_^<_{%^6|2>_55}$'+▒~[[[))))))========-?!?&~~~~~****899)))[[[[[)^·[1$$$·^^·3·/4\\0,_________8 `;



var Item = function Item(id, char, desc, carry, arg, inv) {
  this.id = id;
  this.char = char;
  this.desc = desc;
  this.carry = carry;
  this.arg = arg;
  this.inv = inv;

  if (!arg) this.arg = 0;

  if (!itemlist[id])
    itemlist[id] = this;

}



function createObject(item, arg) {

  if (!item) return null;

  // create item via an ID (used in dnd_store, wizard mode)
  // otherwise the item passed in is already an item to be duplicated
  //if (!isNaN(Number(item)) && item != ``) {
  if (typeof item == 'number') {
    item = itemlist[item];
  }

  var newItem = new Item(item.id, item.char, item.desc, item.carry, item.arg, item.inv);

  if (arg) {
    newItem.arg = arg;
  } else if (item.arg) {
    newItem.arg = item.arg;
  } else {
    newItem.arg = 0;
  }

  return newItem;
}


const DIV_START = `url("img/`;
const DIV_END = `.png")`;



Item.prototype = {
    id: null,
    char: `💩`,
    desc: ``,
    carry: false,
    arg: 0,
    inv: null,

    // TODO: cache this
    getChar: function() {

      if (amiga_mode) {
        if (this.id == OWALL.id) {
          return `${DIV_START}w${this.arg}${DIV_END}`;
        } else {
          return `${DIV_START}o${this.id}${DIV_END}`;
        }
      }
      //
      else if (!original_objects) {
        if (this.id == OWALL.id || this.id == OEMPTY.id) {
          return hack_objnamelist[this.id];
        } else {
          return `<b>${hack_objnamelist[this.id]}</b>`;
        }
      }
      //
      else return this.char;

      // making walls/empty bold screws up horizontal spacing
      //return hack_items ? `${hack_objnamelist[this.id]}` : `${this.char}`;
    },

    matches: function(item) {
      return (this.id == item.id);
    },

    toString: function(inStore, showAll, tempPlayer) {
      var description = this.desc;
      //
      if (this.matches(OPOTION)) {
        if (tempPlayer && !isKnownPotion(this, tempPlayer) && showAll) {
          description += ` (of ${POTION_NAMES[this.arg]})`; // special case for scoreboard
        }
        else if (isKnownPotion(this) || inStore || showAll) {
          description += ` of ${POTION_NAMES[this.arg]}`;
        }
      }
      //
      else if (this.matches(OSCROLL)) {
        if (tempPlayer && !isKnownScroll(this, tempPlayer) && showAll) {
          description += ` (of ${SCROLL_NAMES[this.arg]})`; // special case for scoreboard
        }
        else if (isKnownScroll(this) || inStore || showAll) {
          description += ` of ` + SCROLL_NAMES[this.arg];
        }
      }
      //
      else if (this.matches(OOPENDOOR) ||
        this.matches(OCLOSEDDOOR) ||
        this.matches(OTHRONE) ||
        this.matches(ODEADTHRONE) ||
        this.matches(OBOOK) ||
        this.matches(OCHEST) ||
        (this.isRing() && inStore && !showAll) ||
        this.isGem()) {
        // do nothing
      }
      //
      else {
        if (this.arg > 0) {
          description += ` +` + this.arg;
        } else if (this.arg < 0) {
          description += ` ` + this.arg;
        }
      }
      if (!tempPlayer) tempPlayer = player;
      if ((this === tempPlayer.WEAR || this === tempPlayer.SHIELD) && !inStore) {
        description += ` (being worn)`
      }
      if (this === tempPlayer.WIELD && !inStore) {
        description += ` (weapon in hand)`
      }
      return description;
    },

    // we can wield more things than we show during wield inventory check
    // this is everything that a player can actually wield
    canWield: function() {
      /*
      v12.4.5 - this list is much reduced
      */
      return this.isWeapon() || this.isArmor() || this.isRing();
    },


    // we can wield more things than we show during wield inventory check
    // this is what we show during an inventory check while wielding
    isWeapon: function() {
      var weapon = false;
      weapon |= this.matches(OSHIELD);
      weapon |= this.matches(ODAGGER);
      weapon |= this.matches(OSPEAR);
      weapon |= this.matches(OFLAIL);
      weapon |= this.matches(OBATTLEAXE);
      weapon |= this.matches(OLONGSWORD);
      weapon |= this.matches(O2SWORD);
      weapon |= this.matches(OSWORD);
      weapon |= this.matches(OLANCE);
      weapon |= this.matches(OSWORDofSLASHING);
      weapon |= this.matches(OHAMMER);
      weapon |= this.matches(OBELT);
      return weapon;
    },

    isArmor: function() {
      var armor = false;
      armor |= this.matches(OSHIELD);
      armor |= this.matches(OLEATHER);
      armor |= this.matches(OSTUDLEATHER);
      armor |= this.matches(ORING);
      armor |= this.matches(OCHAIN);
      armor |= this.matches(OSPLINT);
      armor |= this.matches(OPLATE);
      armor |= this.matches(OPLATEARMOR);
      armor |= this.matches(OSSPLATE);
      return armor;
    },

    isGem: function() {
      var gem = false;
      gem |= this.matches(ODIAMOND);
      gem |= this.matches(ORUBY);
      gem |= this.matches(OEMERALD);
      gem |= this.matches(OSAPPHIRE);
      return gem;
    },

    isRing: function() {
      var ring = false;
      ring |= this.matches(ORINGOFEXTRA);
      ring |= this.matches(ODEXRING);
      ring |= this.matches(ODAMRING);
      ring |= this.matches(OREGENRING);
      ring |= this.matches(OSTRRING);
      ring |= this.matches(OPROTRING);
      ring |= this.matches(OCLEVERRING);
      ring |= this.matches(OENERGYRING);
      return ring;
    },

    isStore: function() {
      var store = false;
      store |= this.matches(OENTRANCE);
      store |= this.matches(OBANK);
      store |= this.matches(OBANK2);
      store |= this.matches(OLRS);
      store |= this.matches(OHOME);
      store |= this.matches(ODNDSTORE);
      store |= this.matches(OVOLUP);
      store |= this.matches(OVOLDOWN);
      store |= this.matches(OSCHOOL);
      store |= this.matches(OTRADEPOST);
      return store;
    },

    getSortCode: function() {
      var invcode = this.inv ? this.inv : 0;
      var sortcode = (sortorder.indexOf(this.id) + 1) * 10000 + invcode;

      // sort unknown scrolls and potions above known
      // sort unknown scrolls and potions in inventory order
      // sort known scrolls and potions in inventory order
      if (isKnownScroll(this) || isKnownPotion(this)) {
        sortcode += (this.arg + 1) * 100;
      }

      return sortcode;
    }


  } // ITEM OBJECT




const OEMPTY = new Item(0, `·`, `empty space`, false); // http://www.fileformat.info/info/unicode/char/00b7/index.htm
const OHOMEENTRANCE = new Item(93, OEMPTY.char, `exit to home level`, false);
const OUNKNOWN = new Item(94, ' ', `... nothing`, false);
const OALTAR = new Item(1, `<b>A</b>`, `a holy altar`, false);
const OTHRONE = new Item(2, `<b>T</b>`, `a handsome jewel encrusted throne`, false);
//#define OORB 3
const OPIT = new Item(4, `<b>P</b>`, `a pit`, false);
const OSTAIRSUP = new Item(5, `<b>&lt</b>`, `a staircase going up`, false); // use &lt to prevent bugginess when dropping a ! or ? to the right
//#define OELEVATORUP 6
const OFOUNTAIN = new Item(7, `<b>F</b>`, `a bubbling fountain`, false);
const OSTATUE = new Item(8, `<b>&</b>`, `a great marble statue`, false);
const OTELEPORTER = new Item(9, `<b>^</b>`, `a teleport trap`, false);
const OSCHOOL = new Item(10, `<b>+</b>`, `the College of Larn`, false);
const OMIRROR = new Item(11, `<b>M</b>`, `a mirror`, false);
const ODNDSTORE = new Item(12, `<b>=</b>`, `the DND store`, false);
const OSTAIRSDOWN = new Item(13, `<b>&gt</b>`, `a staircase going down`, false);
//#define OELEVATORDOWN 14
const OBANK2 = new Item(15, `<b>$</b>`, `the 5th branch of the Bank of Larn`, false);
const OBANK = new Item(16, `<b>$</b>`, `the bank of Larn`, false);
const ODEADFOUNTAIN = new Item(17, `<b>f</b>`, `a dead fountain`, false);
const OGOLDPILE = new Item(18, `<b>*</b>`, `some gold`, true, 0);
const OOPENDOOR = new Item(19, `<b>O</b>`, `an open door`, false);
const OCLOSEDDOOR = new Item(20, `<b>D</b>`, `a closed door`, false);
const OWALL = new Item(21, `▒`, `a wall`, false);
const OLARNEYE = new Item(22, `<b>~</b>`, `The Eye of Larn`, true);
const OPLATE = new Item(23, `<b>]</b>`, `plate mail`, true);
const OCHAIN = new Item(24, `<b>[</b>`, `chain mail`, true);
const OLEATHER = new Item(25, `<b>[</b>`, `leather armor`, true);
const OSWORDofSLASHING = new Item(26, `<b>)</b>`, `a sword of slashing`, true);
const OHAMMER = new Item(27, `<b>)</b>`, `Bessman's flailing hammer`, true);
const OSWORD = new Item(28, `<b>)</b>`, `a sunsword`, true);
const O2SWORD = new Item(29, `<b>(</b>`, `a two handed sword`, true);
const OSPEAR = new Item(30, `<b>(</b>`, `a spear`, true);
const ODAGGER = new Item(31, `<b>(</b>`, `a dagger`, true);
const ORINGOFEXTRA = new Item(32, `<b>=</b>`, `ring of extra regeneration`, true);
const OREGENRING = new Item(33, `<b>=</b>`, `a ring of regeneration`, true);
const OPROTRING = new Item(34, `<b>=</b>`, `a ring of protection`, true);
const OENERGYRING = new Item(35, `<b>=</b>`, `an energy ring`, true);
const ODEXRING = new Item(36, `<b>=</b>`, `a ring of dexterity`, true);
const OSTRRING = new Item(37, `<b>=</b>`, `a ring of strength`, true);
const OCLEVERRING = new Item(38, `<b>=</b>`, `a ring of cleverness`, true);
const ODAMRING = new Item(39, `<b>=</b>`, `a ring of increase damage`, true);
const OBELT = new Item(40, `<b>{</b>`, `a belt of striking`, true);
const OSCROLL = new Item(41, `<b>?</b>`, `a magic scroll`, true);
const OPOTION = new Item(42, `<b>!</b>`, `a magic potion`, true);
const OBOOK = new Item(43, `<b>B</b>`, `a book`, true);
const OCHEST = new Item(44, `<b>C</b>`, `a chest`, true);
const OAMULET = new Item(45, `<b>}</b>`, `an amulet of invisibility`, true);
const OORBOFDRAGON = new Item(46, `<b>o</b>`, `an orb of dragon slaying`, true);
const OSPIRITSCARAB = new Item(47, `<b>:</b>`, `a scarab of negate spirit`, true);
const OCUBEofUNDEAD = new Item(48, `<b>;</b>`, `a cube of undead control`, true);
const ONOTHEFT = new Item(49, `<b>,</b>`, `device of theft prevention`, true);
const ODIAMOND = new Item(50, `<b>@</b>`, `a brilliant diamond`, true);
const ORUBY = new Item(51, `<b>@</b>`, `a ruby`, true);
const OEMERALD = new Item(52, `<b>@</b>`, `an enchanting emerald`, true);
const OSAPPHIRE = new Item(53, `<b>@</b>`, `a sparkling sapphire`, true);
const OENTRANCE = new Item(54, `<b>E</b>`, `the dungeon entrance`, false);
const OVOLDOWN = new Item(55, `<b>V</b>`, `a volcanic shaft leaning downward`, false);
const OVOLUP = new Item(56, `<b>V</b>`, `the base of a volcanic shaft`, false);
const OBATTLEAXE = new Item(57, `<b>)</b>`, `a battle axe`, true);
const OLONGSWORD = new Item(58, `<b>)</b>`, `a longsword`, true);
const OFLAIL = new Item(59, `<b>(</b>`, `a flail`, true);
const ORING = new Item(60, `<b>[</b>`, `ring mail`, true);
const OSTUDLEATHER = new Item(61, `<b>[</b>`, `studded leather armor`, true);
const OSPLINT = new Item(62, `<b>]</b>`, `splint mail`, true);
const OPLATEARMOR = new Item(63, `<b>]</b>`, `plate armor`, true);
const OSSPLATE = new Item(64, `<b>]</b>`, `stainless plate armor`, true);
const OLANCE = new Item(65, `<b>)</b>`, `a lance of death`, true);
const OTRAPARROW = new Item(66, `<b>^</b>`, `an arrow trap`, false);
const OTRAPARROWIV = new Item(67, OEMPTY.char, `an arrow trap`, false);
const OSHIELD = new Item(68, `<b>[</b>`, `a shield`, true);
const OHOME = new Item(69, `<b>H</b>`, `your home`, false);
//#define OMAXGOLD 70
//#define OKGOLD 71
//#define ODGOLD 72
const OIVDARTRAP = new Item(73, OEMPTY.char, `a dart trap`, false);
const ODARTRAP = new Item(74, `<b>^</b>`, `a dart trap`, false);
const OTRAPDOOR = new Item(75, `<b>^</b>`, `a trapdoor`, false);
const OIVTRAPDOOR = new Item(76, OEMPTY.char, `a trapdoor`, false);
const OTRADEPOST = new Item(77, `<b>S</b>`, `the local trading post`, false);
const OIVTELETRAP = new Item(78, OEMPTY.char, `a teleport trap`, false);
const ODEADTHRONE = new Item(79, `<b>t</b>`, `a massive throne`, false);
const OLRS = new Item(80, `<b>L</b>`, `the Larn Revenue Service`, false);
//#define OTHRONE2 81
const OANNIHILATION = new Item(82, `<b>s</b>`, `a sphere of annihilation`, false);
const OCOOKIE = new Item(83, `<b>c</b>`, `a fortune cookie`, true);
//#define OURN 84
//#define OBRASSLAMP 85
//#define OHANDofFEAR 86      /* hand of fear */
//#define OSPHTAILSMAN 87     /* tailsman of the sphere */
//#define OWWAND 88           /* wand of wonder */
//#define OPSTAFF 89          /* staff of power */
//#define OVORPAL 90
//#define OSLAYER 91
//#define OELVENCHAIN 92



function isItem(x, y, compareItem) {
  var levelItem = player.level.items[x][y];
  if (levelItem.id == compareItem.id) {
    return true;
  } else {
    return false;
  }
}



function getItemDir(direction) {
  var x = player.x + diroffx[direction];
  var y = player.y + diroffy[direction];
  return itemAt(x, y);
}



function itemAt(x, y) {
  if (x == null || y == null) {
    return null;
  }
  if (x < 0 || x >= MAXX) {
    return null;
  }
  if (y < 0 || y >= MAXY) {
    return null;
  }
  var item = player.level.items[x][y];
  return item;
}


function setItem(x, y, item) {
  if (x == null || y == null) {
    return null;
  }
  if (x < 0 || x >= MAXX) {
    return null;
  }
  if (y < 0 || y >= MAXY) {
    return null;
  }
  player.level.items[x][y] = item;
  return item;
}


function isItemAt(x, y) {
  var item = player.level.items[x][y];
  return (item && !item.matches(OEMPTY));
}



function setWallArg(x, y) {
  var wall = itemAt(x, y);
  if (!wall || !wall.matches(OWALL)) return;
  wall.arg = 0;
  var item;
  item = itemAt(x, y - 1);
  if (item && item.matches(OWALL)) wall.arg += 2; // up
  item = itemAt(x + 1, y);
  if (item && item.matches(OWALL)) wall.arg += 4; // right
  item = itemAt(x, y + 1);
  if (item && item.matches(OWALL)) wall.arg += 8; // down
  item = itemAt(x - 1, y);
  if (item && item.matches(OWALL)) wall.arg += 16; // left
}



function lookforobject(do_ident, do_pickup, do_action) {
  // do_ident;   /* identify item: T/F */
  // do_pickup;  /* pickup item:   T/F */
  // do_action;  /* prompt for actions on object: T/F */


  /* can't find objects if time is stopped    */
  if (player.TIMESTOP)
    return;

  showcell(player.x, player.y);

  var item = player.level.items[player.x][player.y];

  if (item.matches(OEMPTY)) {
    // do nothing
    return;
  }
  //
  else if (item.matches(OGOLDPILE)) {
    updateLog(`You have found some gold!`);
    updateLog(`  It is worth ${item.arg}!`);
    player.setGold(player.GOLD + item.arg);
    forget();
    return;
  }
  //
  else if (item.matches(OALTAR)) {
    //if (nearbymonst()) return;
    if (do_ident) updateLog(`There is a Holy Altar here!`, formatHint('p', 'to pray', 'A', 'to desecrate'));
  }
  //
  else if (item.matches(OTHRONE)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`There is ${item} here!`, formatHint('R', 'remove gems', 's', 'sit down'));
  }
  //
  else if (item.matches(ODEADTHRONE)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`There is ${item} here!`, formatHint('s', 'sit down'));
  }
  //
  else if (item.matches(OPIT)) {
    updateLog(`You're standing at the top of a pit`);
    opit();
  }
  //
  else if (item.matches(OMIRROR)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`There is a mirror here`);
  }
  //
  else if (item.matches(OFOUNTAIN)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`There is a fountain here`, formatHint('f', 'to wash', 'D', 'to drink'));
  }
  //
  else if (item.matches(ODEADFOUNTAIN)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`There is a dead fountain here`);
  }
  //
  else if (item.matches(ODNDSTORE)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`There is a DND store here`, formatHint('e', 'to go inside'));
  }
  //
  else if (item.isStore() && !item.matches(OVOLUP) && !item.matches(OVOLDOWN)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`You have found ${item}`, formatHint('e', 'to go inside'));
  }
  //
  else if (item.matches(OSTATUE)) {
    if (nearbymonst()) return;
    if (do_ident) updateLog(`You are standing in front of a statue`);
  }
  //
  else if (item.matches(OIVTELETRAP)) {
    if (rnd(11) < 6)
      return;
    setItem(player.x, player.y, createObject(OTELEPORTER));
    player.level.know[player.x][player.y] = KNOWALL;
    lookforobject(do_ident, do_pickup, do_action);
    /* fall through to OTELEPORTER case below!!! */
  }
  //
  else if (item.matches(OTELEPORTER)) {
    updateLog(`Zaaaappp!  You've been teleported!`);
    //nap(2000);
    oteleport(0);
  }
  //
  else if (item.matches(OTRAPARROWIV)) {
    /* for an arrow trap */
    if (rnd(17) < 13)
      return;
    setItem(player.x, player.y, createObject(OTRAPARROW));
    player.level.know[player.x][player.y] = KNOWALL;
    /* fall through to OTRAPARROW case below!!! */
    lookforobject(do_ident, do_pickup, do_action);
    return;
  }
  //
  else if (item.matches(OTRAPARROW)) {
    updateLog(`You are hit by an arrow`);
    lastnum = 259; /* shot by an arrow */
    player.losehp(rnd(10) + level);
    return;
  }
  //
  else if (item.matches(OIVDARTRAP)) {
    /* for a dart trap */
    if (rnd(17) < 13)
      return;
    setItem(player.x, player.y, createObject(ODARTRAP));
    player.level.know[player.x][player.y] = KNOWALL;
    /* fall through to ODARTRAP case below!!! */
    lookforobject(do_ident, do_pickup, do_action);
    return;
  }
  //
  else if (item.matches(ODARTRAP)) {
    updateLog(`You are hit by a dart`);
    lastnum = 260; /* hit by a dart */
    player.losehp(rnd(5));
    player.setStrength(player.STRENGTH - 1);
    return;
  }
  //
  else if (item.matches(OIVTRAPDOOR)) {
    /* for a trap door */
    if (rnd(17) < 13)
      return;
    setItem(player.x, player.y, createObject(OTRAPDOOR));
    player.level.know[player.x][player.y] = KNOWALL;
    /* fall through to OTRAPDOOR case below!!! */
    lookforobject(do_ident, do_pickup, do_action);
    return;
  }
  //
  else if (item.matches(OTRAPDOOR)) {
    if ((level == MAXLEVEL - 1) || (level == MAXLEVEL + MAXVLEVEL - 1)) {
      updateLog(`You fell through a bottomless trap door!`);
      //nap(2000);
      died(271, false); /* fell through a bottomless trap door */
    }
    var dmg = rnd(5 + level);
    updateLog(`You fall through a trap door!  You lose ${dmg} hit points`);
    lastnum = 272; /* fell through a trap door */
    player.losehp(dmg);
    //nap(2000);
    newcavelevel(level + 1);
    return;
  }
  //
  else if (item.matches(OANNIHILATION)) {
    updateLog(`You have been enveloped by the zone of nothingness!`);
    died(283, false); /* annihilated in a sphere */
    return;
  }

  else if (item.matches(OSTAIRSUP) || item.matches(OVOLUP)) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('<', 'to climb up'));
  }
  else if (item.matches(OSTAIRSDOWN) || item.matches(OVOLDOWN)) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('>', 'to climb down'));
  }

  else if (item.matches(OPOTION)) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('t', 'to take', 'q', 'to quaff'));
  }
  else if (item.matches(OSCROLL) || item.matches(OBOOK)) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('t', 'to take', 'r', 'to read'));
  }
  else if (item.isArmor()) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('t', 'to take', 'W', 'to wear'));
  }
  else if (item.isWeapon()) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('t', 'to take', 'w', 'to wield'));
  }
  else if (item.matches(OCHEST)) {
    if (do_ident) updateLog(`There is a chest here`, formatHint('t', 'to take', 'o', 'to open'));
  }
  else if (item.matches(OCOOKIE)) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('t', 'to take', 'E', 'to eat'));
  }
  else if (item.carry) {
    if (do_ident) updateLog(`You have found ${item}`, formatHint('t', 'to take'));
  }

  // base case
  else {
    if (do_ident && !item.matches(OWALL)) {
      updateLog(`You have found ${item}`);
    }
  }

  if (do_pickup && item.carry) {
    if (take(item)) {
      forget(); // remove from board
    } else {
      nomove = 1;
    }
  }

} // lookforobject



function formatHint(key1, hint1, key2, hint2) {
  var hintstring1 = `<b>${key1}</b> ${hint1}`;
  var hintstring2 = key2 && hint2 ? `, <b>${key2}</b> ${hint2}` : ``;
  return `[${hintstring1}${hintstring2}]`;
}



function opit() {
  if (rnd(101) >= 81) {
    return;
  }
  if (rnd(70) <= 9 * player.DEXTERITY - packweight() && rnd(101) >= 5) { // BUGFIX this is broken in 12.4
    return;
  }
  if (level == MAXLEVEL - 1 || level >= MAXLEVEL + MAXVLEVEL - 1) {
    obottomless();
  } else {
    var damage = 0;
    if (rnd(101) < 20) {
      updateLog(`You fell into a pit! Your fall is cushioned by an unknown force`);
    } else {
      damage = rnd(level * 3 + 3);
      updateLog(`You fell into a pit! You suffer ${damage} hit points damage`);
      lastnum = 261; /* fell into a pit */
    }
    player.losehp(damage);
    //nap(2000);
    newcavelevel(level + 1);
  }
}



function obottomless() {
  updateLog(`You fell into a bottomless pit!`);
  beep();
  //nap(3000);
  died(262, false); /* fell into a bottomless pit */
}



function forget() {
  player.level.items[player.x][player.y] = OEMPTY;
}



/*
 * subroutine to handle a teleport trap +/- 1 level maximum
 */
function oteleport(err) {
  var tmp;
  if (err) {
    if (rnd(151) < 3) {
      /*
      12.4.5 - you shouldn't get trapped in solid rock with WTW
      */
      if (player.WTW == 0) {
        updateLog(`You are trapped in solid rock!`)
        died(264, false); /* trapped in solid rock */
      }
      else {
        updateLog(`You feel lucky!`)
      }
    }
  }

  if (player.TELEFLAG == 0 && level != 0) {
    changedDepth = millis(); // notify when depth changes to '?'
  }

  player.TELEFLAG = 1; /* show ? on bottomline if been teleported */
  if (level == 0) {
    tmp = 0;
  } else if (level < MAXLEVEL) {
    tmp = rnd(5) + level - 3;
    if (tmp >= MAXLEVEL)
      tmp = MAXLEVEL - 1;
    if (tmp < 1)
      tmp = 1;
  } else {
    tmp = rnd(3) + level - 2;
    if (tmp >= MAXLEVEL + MAXVLEVEL)
      tmp = MAXLEVEL + MAXVLEVEL - 1;
    if (tmp < MAXLEVEL)
      tmp = MAXLEVEL;
  }
  player.x = rnd(MAXX - 2);
  player.y = rnd(MAXY - 2);

  /*
  v12.4.5 - if you hit a monster, and then teleport away, it would keep
            trying to chase you, even if you were really far away.

            BONUS bug: if there is a monster on a *different level* at
            the same location, IT will start to move around, sometimes
            through walls. now fixed in newcavelevel() and a few other
            places also.
  */
  lasthx = 0;
  lasthy = 0;

  if (level != tmp) {
    newcavelevel(tmp);
  }
  positionplayer();
}



/*
 * function to read a book
 */
function readbook(book) {
  var lev = book.arg;
  var i, tmp;
  if (lev <= 3)
    i = rund((tmp = splev[lev]) ? tmp : 1);
  else
    i = rnd((tmp = splev[lev] - 9) ? tmp : 1) + 9;
  learnSpell(spelcode[i]);
  updateLog(`Spell \'<b>${spelcode[i]}</b>\': ${spelname[i]}`);
  updateLog(`  ${speldescript[i]}`);
  if (rnd(10) == 4) {
    updateLog(`  Your intelligence went up by one!`);
    player.setIntelligence(player.INTELLIGENCE + 1);
  }
}



/* function to adjust time when time warping and taking courses in school */
function adjtime(tim) {
  if (player.STEALTH) player.updateStealth(-tim);
  if (player.UNDEADPRO) player.updateUndeadPro(-tim);
  if (player.SPIRITPRO) player.updateSpiritPro(-tim);
  if (player.CHARMCOUNT) player.updateCharmCount(-tim);
  // stop time
  if (player.HOLDMONST) player.updateHoldMonst(-tim);
  if (player.GIANTSTR) player.updateGiantStr(-tim);
  if (player.FIRERESISTANCE) player.updateFireResistance(-tim);
  if (player.DEXCOUNT) player.updateDexCount(-tim);
  if (player.STRCOUNT) player.updateStrCount(-tim);
  if (player.SCAREMONST) player.updateScareMonst(-tim);
  if (player.HASTESELF) player.updateHasteSelf(-tim);
  if (player.CANCELLATION) player.updateCancellation(-tim);
  if (player.INVISIBILITY) player.updateInvisibility(-tim);
  if (player.ALTPRO) player.updateAltPro(-tim);
  if (player.PROTECTIONTIME) player.updateProtectionTime(-tim);
  if (player.WTW) player.updateWTW(-tim);

  player.HERO = player.HERO > 0 ? Math.max(1, player.HERO - tim) : 0;
  player.GLOBE = player.GLOBE > 0 ? Math.max(1, player.GLOBE - tim) : 0;
  player.AWARENESS = player.AWARENESS > 0 ? Math.max(1, player.AWARENESS - tim) : 0;
  player.SEEINVISIBLE = player.SEEINVISIBLE > 0 ? Math.max(1, player.SEEINVISIBLE - tim) : 0;

  player.AGGRAVATE = player.AGGRAVATE > 0 ? Math.max(1, player.AGGRAVATE - tim) : 0;
  player.HASTEMONST = player.HASTEMONST > 0 ? Math.max(1, player.HASTEMONST - tim) : 0;
  player.HALFDAM = player.HALFDAM > 0 ? Math.max(1, player.HALFDAM - tim) : 0;
  player.ITCHING = player.ITCHING > 0 ? Math.max(1, player.ITCHING - tim) : 0;
  player.CLUMSINESS = player.CLUMSINESS > 0 ? Math.max(1, player.CLUMSINESS - tim) : 0;
  // confusion?
  // blindness?

  regen();
}
