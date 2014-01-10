/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
galaga_html5
============

Galaga using html5 and jquery/javascript


Make sure you have jquery on the page.  Also have this in your css:

(or at least with a #YOUR_CANVAS_ID
canvas {
  user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
}

And the setup for the page:

<canvas id="galaga_canvas" width="400" height="400" style="background-color: black; cursor: none;">Unsupported Browser, sorry!</canvas>

<img id="bad1" style="display: none;" src="http://matterickson.me/images/bad1.png" alt="" />
<img id="bad2" style="display: none;" src="http://matterickson.me/images/bad2.png" alt="" />
<img id="bad3" style="display: none;" src="http://matterickson.me/images/bad3.png" alt="" />
<img id="good" style="display: none;" src="http://matterickson.me/images/good.png" alt="" />
