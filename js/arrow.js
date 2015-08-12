// array of all arrows
var arrows = [];

// adjusts arrow speed
var speedMod = 4;

var addArrow = function() {
  arrows.unshift(new Arrow()); // unshift adds to FRONT of arrows array
  currArrow = arrows[0];
}

// Arrow prototype
function Arrow() {
  this.x = shootingCirc.x;
  this.y = shootingCirc.y;
  this.arrowTipCoords = {
    x: this.x+20,
    y: this.y
  };
  // left and right parts of the arrow head
  this.leftTipCoords = {
    x: this.x+17,
    y: this.y-3
  }
  this.rightTipCoords = {
    x: this.x+17,
    y: this.y+3
  }
  this.velX = 0;
  this.velY = 0;
  this.speed = 0;
  this.firing = false;
}
Arrow.prototype.fireArrow = function() {
  if (mousePos && !this.firing) {
    this.speed = Math.min(shootingCirc.r,
                 distBetween(shootingCirc, mousePos)) / speedMod;
    this.velX = Math.cos(angleBetween(mousePos, shootingCirc))*this.speed;
    this.velY = Math.sin(angleBetween(mousePos, shootingCirc))*this.speed;
    this.firing = true;
    addArrow();
  }
}
Arrow.prototype.calcTrajectory = function() {
  if (this.y <= groundPoint && this.firing) {
    this.velY += gravity;
    this.x += this.velX;
    this.y += this.velY;
  } else {
    this.velX = 0;
    this.velY = 0;
    this.firing = false;
  }
};
Arrow.prototype.calcArrowHead = function() {
  if (this.firing) {
    var angle = Math.atan2(this.velX, this.velY);
  } else if (mousePos && this == currArrow) {
    var angle = Math.PI/2 - angleBetween(mousePos, shootingCirc);
  } else return;

  this.arrowTipCoords.x = this.x + 20*Math.sin(angle);
  this.arrowTipCoords.y = this.y + 20*Math.cos(angle);
  var arrowTip = {x:this.arrowTipCoords.x, y:this.arrowTipCoords.y}

  this.leftTipCoords.x = arrowTip.x - 4*Math.sin(angle-Math.PI/4);
  this.leftTipCoords.y = arrowTip.y - 4*Math.cos(angle-Math.PI/4);
  this.rightTipCoords.x = arrowTip.x - 4*Math.sin(angle+Math.PI/4);
  this.rightTipCoords.y = arrowTip.y - 4*Math.cos(angle+Math.PI/4);
};
Arrow.prototype.drawArrow = function() {
  this.calcTrajectory();
  this.calcArrowHead();
  var arrowTip = this.arrowTipCoords;
  var leftTip = this.leftTipCoords;
  var rightTip = this.rightTipCoords;

  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(arrowTip.x, arrowTip.y);

  ctx.moveTo(arrowTip.x, arrowTip.y);
  ctx.lineTo(leftTip.x, leftTip.y);

  ctx.moveTo(arrowTip.x, arrowTip.y);
  ctx.lineTo(rightTip.x, rightTip.y);

  ctx.strokeStyle = "black";
  ctx.stroke();
};
