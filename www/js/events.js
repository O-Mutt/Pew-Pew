var Events = {
	initListeners: function() {
		console.log("Init all the listeners");
		this.initDragStart();
		this.initOnSelect();
		this.initClick();
		switch (Options.ControllerType) {
			case Controller.ACCELEROMETER:
				this.accellerometerWatcherStart();
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
		$(Global.PEWPEW_CANVAS).on('click touchstart', function(e) {
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
						Global.bullets.push(new Bullet(Game.player.x, Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
						Global.bullets.push(new Bullet(Game.player.x, Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
					} else {
						Global.bullets.push(new Bullet(Game.player.x - 1, Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
					}
					Global.playSound(Global.sound11);
				}
			}
			return false;
		});
	},
    
	mouseMove: function() {
		console.log("Init move");
		$(Global.PEWPEW_CANVAS).off('mousemove');
		//Mouse listener
		$(Global.PEWPEW_CANVAS).on('mousemove', function(event) {
			HandleMouseMove(event);
		});
	},
	
	/** Accelerometer controller **/
	accellerometerWatcherStart: function() {
		var options = { frequency: 500 };

        Global.AccelorometerWatcherId = navigator.accelerometer.watchAcceleration(HandleAccelerometer, null, options);
	},
	accellerometerWatcherStop: function() {
		if (Global.AccelorometerWatcherId) {
            navigator.accelerometer.clearWatch(Global.AccelorometerWatcherId);
            Global.AccelorometerWatcherId = null;
        }
	},

	keyDown: function() {
		console.log("Init key down");
		$(Global.PEWPEW_CANVAS).on('keydown', function(event) {
			if (event.which == 32 && Global.intervalLoop == 0) {
				Game.Start();
				Global.mouse.x = 50;
				redrawPlayerPewPew();
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
	}
}

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
    if (Options.gameTypeClassic) {
        Game.player.y = Global.PEWPEW_CANVAS.height - (Game.player.height * 2);//leave space for the player finger/score
    } else {
        Game.player.y = Global.mouse.y;
    }
}

function HandleAccelerometer(accelerometer) {
	console.log("Handle accelerometer");
	if (!Game.player.x) {
		Game.player.x = 0;
	}
	Game.player.acceleration += accelerometer.x;
}