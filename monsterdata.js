'use strict';


/************************************************/
/* never, ever, never use a code formatter here */
/************************************************/


/*
 *  for the monster data
 *
 *  array to do rnd() to create monsters <= a given level
 */
const monstlevel = [5, 11, 17, 22, 27, 33, 39, 42, 46, 50, 53, 56, 59];



//new Monster(`<font color='red'>B</font>`, `bat`, 1, 0, 1, 0, 0, 3, 0, 1, 1), // this works, but is not HTML5
//new Monster(`<p style='color:red'>G</p>`, `gnome`, 1, 10, 1, 0, 0, 8, 30, 2, 2), // using CSS messes up the screen badly
const monsterlist = [
  // 0
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(` `, ` `,                             0,   0,  0,  0,  0,  3,  0,    0,   0),
  new Monster(`B`, `bat`,                           1,   0,  1,  0,  0,  3,  0,    1,   1),
  new Monster(`G`, `gnome`,                         1,   10, 1,  0,  0,  8,  30,   2,   2),
  new Monster(`H`, `hobgoblin`,                     1,   14, 2,  0,  0,  5,  25,   3,   2),
  new Monster(`J`, `jackal`,                        1,   17, 1,  0,  0,  4,  0,    1,   1),
  new Monster(`K`, `kobold`,                        1,   20, 1,  0,  0,  7,  10,   1,   1),
  // 6
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`O`, `orc`,                           2,   12, 1,  0,  0,  9,  40,   4,   2),
  new Monster(`S`, `snake`,                         2,   15, 1,  0,  0,  3,  0,    3,   1),
  new Monster(`c`, `giant centipede`,               2,   14, 0,  4,  0,  3,  0,    1,   2),
  new Monster(`j`, `jaculi`,                        2,   20, 1,  0,  0,  3,  0,    2,   1),
  new Monster(`t`, `troglodyte`,                    2,   10, 2,  0,  0,  5,  80,   4,   3),
  new Monster(`A`, `giant ant`,                     2,   8,  1,  4,  0,  4,  0,    5,   5),
  // 12
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`E`, `floating eye`,                  3,   8,  1,  0,  0,  3,  0,    5,   2),
  new Monster(`L`, `leprechaun`,                    3,   3,  0,  8,  0,  3,  1500, 13,  45),
  new Monster(`N`, `nymph`,                         3,   3,  0,  14, 0,  9,  0,    18,  45),
  new Monster(`Q`, `quasit`,                        3,   5,  3,  0,  0,  3,  0,    10,  15),
  new Monster(`R`, `rust monster`,                  3,   4,  0,  1,  0,  3,  0,    18,  25),
  new Monster(`Z`, `zombie`,                        3,   12, 2,  0,  0,  3,  0,    6,   7),
  // 18
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`a`, `assassin bug`,                  4,   9,  3,  0,  0,  3,  0,    20,  15),
  new Monster(`b`, `bugbear`,                       4,   5,  4,  15, 0,  5,  40,   20,  35),
  new Monster(`h`, `hell hound`,                    4,   5,  2,  2,  0,  6,  0,    16,  35),
  new Monster(`i`, `ice lizard`,                    4,   11, 2,  10, 0,  6,  50,   16,  25),
  new Monster(`C`, `centaur`,                       4,   6,  4,  0,  0,  10, 40,   24,  45),
  // 23
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`T`, `troll`,                         5,   4,  5,  0,  0,  9,  80,   50,  300),
  new Monster(`Y`, `yeti`,                          5,   6,  4,  0,  0,  5,  50,   35,  100),
  new Monster(`d`, `white dragon`,                  5,   2,  4,  5,  0,  16, 500,  55,  1000),
  new Monster(`e`, `elf`,                           5,   8,  1,  0,  0,  15, 50,   22,  35),
  new Monster(`g`, `gelatinous cube`,               5,   9,  1,  0,  0,  3,  0,    22,  45),
  // 28
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`m`, `metamorph`,                     6,   7,  3,  0,  0,  3,  0,    30,  40),
  new Monster(`v`, `vortex`,                        6,   4,  3,  0,  0,  3,  0,    30,  55),
  new Monster(`z`, `ziller`,                        6,   15, 3,  0,  0,  3,  0,    30,  35),
  new Monster(`F`, `violet fungi`,                  6,   12, 3,  0,  0,  3,  0,    38,  100),
  new Monster(`W`, `wraith`,                        6,   3,  1,  6,  0,  3,  0,    30,  325),
  new Monster(`f`, `forvalaka`,                     6,   2,  5,  0,  0,  7,  0,    50,  280),
  // 34
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`l`, `lawless`,                       7,   7,  3,  0,  0,  6,  0,    35,  80),
  new Monster(`o`, `osequip`,                       7,   4,  3,  16, 0,  4,  0,    35,  100),
  new Monster(`r`, `rothe`,                         7,   15, 5,  0,  0,  3,  100,  50,  250),
  new Monster(`X`, `xorn`,                          7,   0,  6,  0,  0,  13, 0,    60,  300),
  new Monster(`V`, `vampire`,                       7,   3,  4,  6,  0,  17, 0,    50,  1000),
  new Monster(OEMPTY.char, `invisible stalker`,     7,   3,  6,  0,  0,  5,  0,    50,  350),
  // 40
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`p`, `poltergeist`,                   8,   1,  4,  0,  0,  3,  0,    50,  450),
  new Monster(`q`, `disenchantress`,                8,   3,  0,  9,  0,  3,  0,    50,  500),
  new Monster(`s`, `shambling mound`,               8,   2,  5,  0,  0,  6,  0,    45,  400),
  new Monster(`y`, `yellow mold`,                   8,   12, 4,  0,  0,  3,  0,    35,  250),
  new Monster(`U`, `umber hulk`,                    8,   3,  7,  11, 0,  14, 0,    65,  600),
  // 45
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`k`, `gnome king`,                    9,  -1,  10, 0,  0,  18, 2000, 100, 3000),
  new Monster(`M`, `mimic`,                         9,   5,  6,  0,  0,  8,  0,    55,  99),
  new Monster(`w`, `water lord`,                    9,  -10, 15, 7,  0,  20, 0,    150, 15000),
  new Monster(`D`, `bronze dragon`,                 9,   2,  9,  3,  0,  16, 300,  80,  4000),
  new Monster(`D`, `green dragon`,                  9,   3,  8,  10, 0,  15, 200,  70,  2500),
  new Monster(`P`, `purple worm`,                   9,  -1,  11, 0,  0,  3,  100,  120, 15000),
  new Monster(`x`, `xvart`,                         9,  -2,  12, 0,  0,  13, 0,    90,  1000),
  // 52
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP   EXP */
  new Monster(`n`, `spirit naga`,                   10, -20, 12, 12, 0,  23, 0,    95,  20000),
  new Monster(`D`, `silver dragon`,                 10, -1,  12, 3,  0,  20, 700,  100, 10000),
  new Monster(`D`, `platinum dragon`,               10, -5,  15, 13, 0,  22, 1000, 130, 24000),
  new Monster(`u`, `green urchin`,                  10, -3,  12, 0,  0,  3,  0,    85,  5000),
  new Monster(`D`, `red dragon`,                    10, -2,  13, 3,  0,  19, 800,  110, 14000),
  // 57
  /*          CHAR         NAME                     LV   AC  DAM ATT DEF INT GOLD  HP  EXP */
  new Monster(OEMPTY.char, `type I demon lord`,     12, -30, 18, 0,  0,  20, 0,    140, 50000),
  new Monster(OEMPTY.char, `type II demon lord`,    13, -30, 18, 0,  0,  21, 0,    160, 75000),
  new Monster(OEMPTY.char, `type III demon lord`,   14, -30, 18, 0,  0,  22, 0,    180, 100000),
  new Monster(OEMPTY.char, `type IV demon lord`,    15, -35, 20, 0,  0,  23, 0,    200, 125000),
  new Monster(OEMPTY.char, `type V demon lord`,     16, -40, 22, 0,  0,  24, 0,    220, 150000),
  new Monster(OEMPTY.char, `type VI demon lord`,    17, -45, 24, 0,  0,  25, 0,    240, 175000),
  new Monster(OEMPTY.char, `type VII demon lord`,   18, -70, 27, 6,  0,  26, 0,    260, 200000),
  new Monster(OEMPTY.char, `demon prince`,          25, -127,30, 6,  0,  28, 0,    345, 300000)
];



/* defines for the monsters as objects */
const BAT = 1;
const GNOME = 2;
const HOBGOBLIN = 3;
const JACKAL = 4;
const KOBOLD = 5;
const ORC = 6;
const SNAKE = 7;
const CENTIPEDE = 8;
const JACULI = 9;
const TROGLODYTE = 10;
const ANT = 11;
const EYE = 12;
const LEPRECHAUN = 13;
const NYMPH = 14;
const QUASIT = 15;
const RUSTMONSTER = 16;
const ZOMBIE = 17;
const ASSASSINBUG = 18;
const BUGBEAR = 19;
const HELLHOUND = 20;
const ICELIZARD = 21;
const CENTAUR = 22;
const TROLL = 23;
const YETI = 24;
const WHITEDRAGON = 25;
const ELF = 26;
const CUBE = 27;
const METAMORPH = 28;
const VORTEX = 29;
const ZILLER = 30;
const VIOLETFUNGI = 31;
const WRAITH = 32;
const FORVALAKA = 33;
const LAMANOBE = 34;
const OSEQUIP = 35;
const ROTHE = 36;
const XORN = 37;
const VAMPIRE = 38;
const INVISIBLESTALKER = 64;
const STALKER = 39;
const POLTERGEIST = 40;
const DISENCHANTRESS = 41;
const SHAMBLINGMOUND = 42;
const YELLOWMOLD = 43;
const UMBERHULK = 44;
const GNOMEKING = 45;
const MIMIC = 46;
const WATERLORD = 47;
const BRONZEDRAGON = 48;
const GREENDRAGON = 49;
const PURPLEWORM = 50;
const XVART = 51;
const SPIRITNAGA = 52;
const SILVERDRAGON = 53;
const PLATINUMDRAGON = 54;
const GREENURCHIN = 55;
const REDDRAGON = 56;
const DEMONLORD = 57;

const DEMONPRINCE = 64;
