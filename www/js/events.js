var Events = {
	initListeners: function() {
		if (Constants.DEBUG) console.log($(GALAGA_CANVAS));
		this.initDragStart();
		this.initOnSelect();
		this.initClick();
		this.mouseMove();
		this.keyDown();
		this.initWindowResize();
	},
	
	initWindowResize: function() {
		window.onresize = this.SizeChanged();
	},
	
	SizeChanged: function() {
		if (Constants.DEBUG) console.log("Resize window");
		Global.canvasWidth = window.innerWidth;
		Global.canvasHeight = window.innerHeight;
	},
	
	initDragStart: function() {	
		if (Constants.DEBUG) console.log("Init drag");
		// do nothing in the event handler except cancelling the event
		$.on('dragstart', $(GALAGA_CANVAS), function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
		});
	},
	
	initOnSelect: function() {
		if (Constants.DEBUG) console.log("Init select");
		// do nothing in the event handler except cancelling the event
		$.on('selectstart', $(GALAGA_CANVAS), function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
		});
    },
	
	initClick: function() {
		if (Constants.DEBUG) console.log("Init click");
		$.on('click', $(GALAGA_CANVAS), function(e) {
		  e.preventDefault();

		  if (Global.intervalLoop == 0) {
			sound9.play();
			setStartGame(5);
		  } else {
			  var maxBulletsNum = 4;
			  if (Global.isGalagaMerged)
				  maxBulletsNum *= numOfGalaga;
			  if (Global.bullets && Global.bullets.length < maxBulletsNum) {
				  if (Global.isGalagaMerged) {
					  Global.bullets.push(new Bullet(player.x - 1 - Constants.GUYOFFSET, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
					  Global.bullets.push(new Bullet(player.x + 1 + Constants.GUYOFFSET, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
				  } else {
					Global.bullets.push(new Bullet(player.x - 1, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
				  }
				  sound11.play();
			  }
		  }
		  return false;
		});
	},
    
	mouseMove: function() {
		if (Constants.DEBUG) console.log("Init move");
		//Mouse listener
		$.on('mousemove', $(GALAGA_CANVAS), function(event) {
			setMousePosition(event);
		});
	},

	keyDown: function() {
		if (Constants.DEBUG) console.log("Init key down");
		$.on('keydown', $(GALAGA_CANVAS), function(event) {
			if (event.which == 32 && Global.intervalLoop == 0) {
				setStartGame(5);
				Global.mouse.x = 50;
				redrawPlayerGalaga();
			}
			if (!Constants.isCapturing){
				Game.pressedKeys[event.which] = true;
				// console.log(event.which)
			}
			return false;
		});
	},
	
	keyUp: function() {
		if (Constants.DEBUG) console.log("Init key up");
		$.on('keyup', $(GALAGA_CANVAS), function(event) {
			Game.pressedKeys[event.which] = false;
		});
	},
}