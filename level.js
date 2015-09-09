"use strict";

var Level = {
  items: [],
  monsters: [],
  know: [],
}; // Level



function paint() {

  DEBUG_PAINT++;

  //if (!amiga_mode) amiga_mode = true;

  if (IN_STORE) {
    drawstore();
  } else {
    drawscreen();
    botside();
    bottomline();
  }

  blt();

}


var images = null;



function blt() {
  if (amiga_mode && CANVAS_MODE) {
    if (!images) {
      loadImages();
    }
    document.getElementById("LARN").innerHTML = "";
    return bltAmiga();
  }

  var output = "";
  for (var y = 0; y < 24; y++) {
    for (var x = 0; x < 80; x++) {
      output += display[x][y] != null ? display[x][y] : ' ';
    } // inner for
    output += "\n";
  } // outer for
  document.getElementById("LARN").innerHTML = output;
}


function loadImages() {
  images = [];

  console.log("loading images");

  var img;
  for (var i = 0; i <= 67; i++) {
    img = `img/m${i}.png`;
    images[img] = createImage(img);
  }
  for (var i = 0; i <= 94; i++) {
    img = `img/o${i}.png`;
    images[img] = createImage(img);
  }
  for (var i = 0; i <= 30; i += 2) {
    img = `img/w${i}.png`;
    images[img] = createImage(img);
  }
  img = `img/player.png`;
  images[img] = createImage(img);
}

function createImage(src) {
  //console.log("loading: " + src);
  var image = new Image();
  image.onload = function() {
    //console.log("loaded: " + src);
  }
  image.src = src;
  return image;
}


var IS_BOLD;

function bltAmiga() {
  var canvas = document.getElementById("lCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  IS_BOLD = false;

  for (var y = 0; y < 24; y++) {
    for (var x = 0; x < 80; x++) {

      if (display[x][y].indexOf('png') >= 0) {

        var image = images[display[x][y]];
        if (!image) {
          console.log(`can't find image: ${display[x][y]}`);
          image = createImage(display[x][y]);
          continue;
        }
        image.xx = x * 9;
        image.yy = y * 18;
        image.src = display[x][y];
        ctx.drawImage(image, image.xx, image.yy, 9, 18);

      } else {
        var output = display[x][y];
        if (output.indexOf('<b>') >= 0) {
          // console.log(output);
          IS_BOLD = true;
          output = output.substring(3);
        }
        if (output.indexOf('</b>') >= 0) {
          // console.log(output);
          IS_BOLD = false;
          output = output.substring(4);
        }
        if (IS_BOLD) {
          ctx.font = `bold 12px monospace`;
          ctx.fillStyle = "white";
        } else {
          ctx.font = `12px monospace`;
          ctx.fillStyle = "lightgrey";
        }
        ctx.textBaseline = "top";
        ctx.fillText(output, 1 + x * 9, 1 + y * 18);
      }

    } // inner for
  } // outer for

}



function drawstore() {
  var doc = document.getElementById("STATS");
  if (doc)
    document.getElementById("STATS").innerHTML = DEBUG_STATS ? game_stats() : "";
}
