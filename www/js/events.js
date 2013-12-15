
var Events = {
	initListeners: function() {
		if (Constants.DEBUG) console.log("Init all the listeners");
		this.initDragStart();
		this.initOnSelect();
		this.initClick();
		this.mouseMove();
		this.keyDown();
		this.initWindowResize();
	},
	
	initWindowResize: function() {
		if (Constants.DEBUG) console.log("init Resize window");
		window.onresize = this.SizeChanged();
	},
	
	SizeChanged: function() {
		if (Constants.DEBUG) console.log("Resize window");
		Global.GALAGA_CANVAS.width = window.innerWidth;
		Global.GALAGA_CANVAS.height = window.innerHeight;
	},
	
	initDragStart: function() {	
		if (Constants.DEBUG) console.log("Init drag");
		// do nothing in the event handler except cancelling the event
		$(Global.GALAGA_CANVAS).on('dragstart', function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
		});
	},
	
	initOnSelect: function() {
		if (Constants.DEBUG) console.log("Init select");
		// do nothing in the event handler except cancelling the event
		$(Global.GALAGA_CANVAS).on('selectstart', function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
		});
    },
	
	initClick: function() {
		if (Constants.DEBUG) console.log("Init click");
		$(Global.GALAGA_CANVAS).on('click', function(e) {
			e.preventDefault();
			
			console.log("click loop [" + Global.intervalLoop + "]");	
			if (Global.intervalLoop == 0) {
				Global.sound9.play();
				setStartGame(5);
			  } else {
				  var maxBulletsNum = 4;
				  if (Global.isGalagaMerged)
					  maxBulletsNum *= Global.numOfGalaga;
				  if (Global.bullets && Global.bullets.length < maxBulletsNum) {
					  if (Global.isGalagaMerged) {
						  Global.bullets.push(new Bullet(Game.player.x - 1 - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
						  Global.bullets.push(new Bullet(Game.player.x + 1 + Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
					  } else {
						Global.bullets.push(new Bullet(Game.player.x - 1, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
					  }
					  Global.sound11.play();
				  }
			  }
			  return false;
		});
	},
    
	mouseMove: function() {
		if (Constants.DEBUG) console.log("Init move");
		//Mouse listener
		$(Global.GALAGA_CANVAS).on('mousemove', function(event) {
			setMousePosition(event);
		});
	},

	keyDown: function() {
		if (Constants.DEBUG) console.log("Init key down");
		$(Global.GALAGA_CANVAS).on('keydown', function(event) {
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
		$(Global.GALAGA_CANVAS).on('keyup', function(event) {
			Game.pressedKeys[event.which] = false;
		});
	},
}