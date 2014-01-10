var Global = new function() {
	//Multiple inits
	this.bullets = new Array();////bullets fired by player
	this.barrierBullets = new Array();
	this.badGuys = new Array(); //the bad guys
	this.bossFire = new Array(); //Important interval handler!
	this.fakeGame = 0;
	this.bulletsControl = {};	
	this.luckyLife = 0;
	// for capture
	this.isCaptured = false;
	this.isCapturing = false;
	this.isPewPewMerged = false;
	this.isPewPewMerging = false;
	this.numOfPewPew = 1;
	this.isSpiderMove = false;
	this.hasSpider = false;
	this.spider;
	this.spiderCount = 0;
	this.isViming = false;
	this.oriPosX;
	this.oriPosY;
	this.vim;
	
	var PEWPEW_CANVAS;
	var PEWPEW_CONTEXT;
	this.scaling = function() {
		return this.PEWPEW_CANVAS.height / 450;
	};
	
	this.lives_height = function() {
		return 20 * Global.scaling();
	};
	this.lives_width = function() {
		return 20 * Global.scaling();
	};
	this.intervalLoop = 0;

	this.isSoundEnabled = false;
	this.sound0;
	this.sound1;
	this.sound2;
	this.sound3;
	this.sound4;
	this.sound5;
	this.sound6;
	this.sound7;
	this.sound8;
	this.sound9;
	this.sound10;
	this.sound11;
	this.sound12;
	this.sound13;
	this.sound14;
	
	this.playSound = function(sound) {
		if (this.isSoundEnabled) sound.play();
	};
	
	this.mouse = new Mouse();;
	this.bad1;
	this.bad2;
	this.bad3;
	this.good;
	this.boss;
	this.explosion;
	this.laser;
	this.AccelerometerWatcherId;
};