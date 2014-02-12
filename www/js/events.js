/**
 * Copyright (c) 2014, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
var Events = {
	initListeners: function() {
		console.log("Init all the listeners");
		this.initDragStart();
		this.initOnSelect();
		this.initClick();
		switch (Options.ControllerType) {
			case Controller.ACCELEROMETER:
				this.accelerometerWatcherStart();
				break;
			case Controller.MOUSE:
				this.mouseMove();
				break;
		}
		this.keyDown();
		this.initWindowResize();
	},
	
	initWindowResize: function() {
		console.log("init Resize window");
		window.onresize = this.SizeChanged();
	},
	
	SizeChanged: function() {
		console.log("Resize window width [" + window.innerWidth + "] height [" + window.innerHeight + "]");
		Global.PEWPEW_CANVAS.width = window.innerWidth;
		Global.PEWPEW_CANVAS.height = window.innerHeight;
	},
	
	initDragStart: function() {	
		console.log("Init drag");
		// do nothing in the event handler except cancelling the event
		$(Global.PEWPEW_CANVAS).on('dragstart', function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
		});
	},
	
	initOnSelect: function() {
		console.log("Init select");
		// do nothing in the event handler except cancelling the event
		$(Global.PEWPEW_CANVAS).on('selectstart', function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
		});
    },
	
	initClick: function() {
		console.log("Init click");
		Global.PEWPEW_CANVAS.addEventListener('touchstart', function(e) {
			e.preventDefault();
	
			if (Global.intervalLoop == 0) {
				Global.playSound(Global.sound9);
				Game.Mechanics.Start();
			} else {
				var maxBulletsNum = 4;
				if (Global.isPewPewMerged) {
					maxBulletsNum *= Global.numOfPewPew;
				}
				if (Global.bullets && Global.bullets.length < maxBulletsNum) {
					if (Global.isPewPewMerged) {
						Global.bullets.push(new Bullet(Game.player.x, Game.player.top(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
						Global.bullets.push(new Bullet(Game.player.x, Game.player.top(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
					} else {
						Global.bullets.push(new Bullet(Game.player.x - 1, Game.player.top(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
					}
					Global.playSound(Global.sound11);
				}
			}
			if (Options.ControllerType == Controller.TOUCH) {
				Game.player.moveTo = e.touches[0].pageX;
			}
			return false;
		});
	},
    
	mouseMove: function() {
		console.log("Init mouse move");
		this.accelerometerWatcherStop();
		$(Global.PEWPEW_CANVAS).off('mousemove');
		//Mouse listener
		$(Global.PEWPEW_CANVAS).on('mousemove', function(event) {
			HandleMouseMove(event);
		});
	},
	
	/** Accelerometer controller **/
	accelerometerWatcherStart: function() {
		$(Global.PEWPEW_CANVAS).off('mousemove');
		console.log("Start accelerometer");
        Global.AccelerometerWatcherId = navigator.accelerometer.watchAcceleration(HandleAccelerometerSuccess, HandleAccelerometerError, Options.AccelerometerOptions);
        console.log(Global.AccelerometerWatcherId);
	},
	accelerometerWatcherStop: function() {
		if (Global.AccelerometerWatcherId) {
            navigator.accelerometer.clearWatch(Global.AccelerometerWatcherId);
            Global.AccelerometerWatcherId = null;
        }
	},

	keyDown: function() {
		console.log("Init key down");
		$(Global.PEWPEW_CANVAS).on('keydown', function(event) {
			if (event.which == 32 && Global.intervalLoop == 0) {
				Game.Start();
				Global.mouse.x = 50;
				Redraw.GoodGuy.RedrawPlayer();
			}
			if (!Constants.isCapturing){
				Game.pressedKeys[event.which] = true;
				// console.log(event.which)
			}
			return false;
		});
	},
	
	keyUp: function() {
		console.log("Init key up");
		$(Global.PEWPEW_CANVAS).on('keyup', function(event) {
			Game.pressedKeys[event.which] = false;
		});
	},
};

function HandleMouseMove(event) {
    var rect = Global.PEWPEW_CANVAS.getBoundingClientRect();
    Global.mouse.x = event.clientX - rect.left;
    Global.mouse.y = event.clientY - rect.top;
    if(!Global.isCapturing && !Global.isPewPewMerging){
		//console.log("derp");
        if (Global.mouse.x < Game.player.width) {
			console.log("Mouse is less than scaled width?");
			Game.player.x = Game.player.width;
		} else if (Global.mouse.x > Global.PEWPEW_CANVAS.width - Game.player.width) {
			Game.player.x = Global.PEWPEW_CANVAS.width - Game.player.width;
		} else {
			Game.player.x = Global.mouse.x;
		}
    }
	Game.player.movePlayerY();
}

function HandleAccelerometerSuccess(accelerometer) {
	console.log("Handle accelerometer");
	Game.player.movePlayerY();
	if (!Game.player.x) {
		Game.player.x = 0;
	}
	
	console.log(accelerometer);
	
	Game.player.acceleration += accelerometer.x;
}

function HandleAccelerometerError() {
	console.log("accelerometer error");
}
