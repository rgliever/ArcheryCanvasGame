// Ryan Gliever -- 2015

///////////////////////
// CREATE THE CANVAS //
var canvas = document.createElement("canvas");
canvas.id = 'canvas';
var ctx = canvas.getContext("2d");
canvas.width=window.innerWidth - 15;
canvas.height=window.innerHeight - 15;
document.body.appendChild(canvas);
cWidth=canvas.width;
cHeight=canvas.height;
// // // // // // // //
///////////////////////

// gravity and stuff
var gravity = 0.4;
var groundPoint = cHeight - (cHeight/4);

// drawnBack and firedArrow booleans to assert state of currArrow
var drawnBack = false;
var firedArrow = false;

// calculate distance between two points
var distBetween = function(p1, p2) {
  return Math.sqrt( Math.pow((p2.x-p1.x), 2)
                  + Math.pow((p2.y-p1.y), 2) );
}

// checks if the mouse position is within < radius distance to the center
// of the shooting circle
var isInCircle = function(mousePos) {
  var distFromCenter = distBetween(drawBackCirc, mousePos);
  if (distFromCenter < drawBackCirc.r) return true;
  else return false;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

/////////////////////
// EVENT LISTENERS //
var mousePos;
var mouseDown = false;
var mouseUp = false;
// MOUSE MOVE
addEventListener("mousemove", function(evt) {
  mousePos = getMousePos(canvas, evt);
}, false);
// MOUSE DOWN
addEventListener("mousedown", function(evt) {
  mousePos = getMousePos(canvas, evt);
  mouseDown = true;
  mouseUp = false;
}, false);
// MOUSE UP
addEventListener("mouseup", function(evt) {
  mousePos = getMousePos(canvas, evt);
  mouseUp = true;
  mouseDown = false;
}, false);
// // // // // // //
/////////////////////

var drawScene = function() {
  // increased groundPoint so arrows stick where they should in the ground
  var ground = groundPoint + 15;
  // sky
  ctx.fillStyle="rgba(0,0,200,0.2)";
  ctx.fillRect(0,0,cWidth,ground);
  // ground
  ctx.beginPath();
  ctx.moveTo(0, ground);
  ctx.lineTo(cWidth, ground);
  ctx.strokeStyle="rgba(0,100,50,0.6)";
  ctx.stroke();
  ctx.fillStyle="rgba(0,200,100,0.6)";
  ctx.fillRect(0,ground,cWidth,cHeight);
}

// calculate angle between two points
var angleBetween = function(p1, p2) {
  return Math.atan2(p2.y-p1.y, p2.x-p1.x);
}

// SHOOTING CIRCLES //
var getAimCoords = function(mousePos) {
  /* NOTE: angleBetween(p1, p2) is 180deg opposite of angleBetween(p2, p1) */
  var angle = Math.PI/2 - angleBetween(mousePos, shootingCirc);
  var distance = Math.min(distBetween(shootingCirc, mousePos), shootingCirc.r);
  var x = shootingCirc.x + distance*Math.sin(angle);
  var y = shootingCirc.y + distance*Math.cos(angle);
  return {x:x, y:y};
}
var drawAimer = function() {
  if (drawnBack) {
    aimCoords = getAimCoords(mousePos);
    ctx.beginPath();
    ctx.moveTo(aimCoords.x, aimCoords.y);
    ctx.lineTo(shootingCirc.x, shootingCirc.y);
    ctx.strokeStyle="rgba(0,0,0,0.2)";
    ctx.stroke();
  }
}
var shootingCirc = {
  x: 200,
  y: groundPoint-200,
  r: 75
}
var drawBackCirc = {
  x: shootingCirc.x,
  y: shootingCirc.y,
  r: 10
}
var drawCircles = function() {
  ctx.beginPath();
  ctx.arc(shootingCirc.x, shootingCirc.y, shootingCirc.r, 0, 2*Math.PI);
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(drawBackCirc.x, drawBackCirc.y, drawBackCirc.r, 0, 2*Math.PI);
  ctx.stroke();
  drawAimer();
}

var isFiredArrow = function() {
  if (mousePos && drawnBack && mouseUp) {
    drawnBack = false;
    firedArrow = true;
  }
}

var isDrawnBack = function() {
  if (mousePos && isInCircle(mousePos)) {
    if (mouseDown) drawnBack = true;
    else if (mouseUp) drawnBack = false;
  }
}

var writeInfo = function(mousePos) {
  ctx.font = "11px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  if(isInCircle(mousePos) && mouseDown) {
    ctx.fillStyle = "red";
  } else {
    ctx.fillStyle = "black";
  }
  ctx.fillText("Mouse Position: " + mousePos.x + ", " + mousePos.y, 20, 20);
  ctx.fillText("Circle Position: " + shootingCirc.x + ", " + shootingCirc.y, 20, 40);
  ctx.fillText("Angle: " + angleBetween(mousePos, shootingCirc), 20, 60);
}



// UPDATE //
var update = function() {
  isDrawnBack();
  isFiredArrow();
  if (firedArrow) {
    currArrow.fireArrow();
    firedArrow = false;
  }
  // clear the canvas
  ctx.clearRect(0,0,cWidth,cHeight);
}

// RENDER //
var render = function() {
  // if(mousePos) writeInfo(mousePos);
  drawCircles();
  for(i=0; i<arrows.length; i++) {
    arrows[i].drawArrow();
  }
  drawScene();
}

// *** |\/| /_\ | |\| *** //
var main = function() {
  update();
  render();
  requestAnimationFrame(main);
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// add initial arrow
addArrow();
var currArrow = arrows[0];
main();
