---
title: How to draw a star with the HTML5 Canvas API
publishedDate: 2012-04-23T21:02
---

A quick and simple introduction to drawing with the 2D canvas API, using a star as an example. Try [this JsFiddle](http://jsfiddle.net/earnubs/TZasK/) to play around with different shapes.

```
var canvas;
var ctx;
var length = 15; // length of the star's arm

// get a reference to the 2d context from canvas element
canvas = document.getElementById("star");
ctx = canvas.getContext("2d");

// move into the middle of the canvas, just to make room
ctx.translate(150, 150);

// initial offset rotation so our star is straight
// this offset is half the angle of a 5 star point, which
// is 36°, so 18° which in radians is:
ctx.rotate((Math.PI * 1 / 10));

// make a point, 5 times
for (var i = 5; i--;) {
  // draw line up
  ctx.lineTo(0, length);
  // move origin to current same location as pen
  ctx.translate(0, length);
  // rotate the drawing board the angle of a star point
  ctx.rotate((Math.PI * 2 / 10));
  // draw line down
  ctx.lineTo(0, -length);
  // again, move origin to pen...
  ctx.translate(0, -length);
  // ...and rotate, ready for next arm
  // this rotation is the angle between the points, 120°
  ctx.rotate(-(Math.PI * 6 / 10));
}
// last line to connect things up
ctx.lineTo(0, length);
ctx.closePath();
// stroke the path, you could also .fill()
ctx.stroke();
```
