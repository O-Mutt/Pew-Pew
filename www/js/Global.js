var Global = Global || {};

//Multiple inits
Global.bullets = new Array();////bullets fired by player
Global.barrierBullets = new Array();
Global.badGuys = new Array(); //the bad guys
Global.bossFire = new Array(); //Important interval handler!
Global.fakeGame = 0;
Global.bulletsControl = {};	
Global.luckyLife = 0;
// for capture
Global.isCaptured = false;
Global.isCapturing = false;
Global.isPewPewMerged = false;
Global.isPewPewMerging = false;
Global.numOfPewPew = 1;
Global.isSpiderMove = false;
Global.hasSpider = false;
Global.spider;
Global.spiderCount = 0;
Global.isViming = false;
Global.oriPosX;
Global.oriPosY;
Global.vim;

Global.PEWPEW_CANVAS;
Global.PEWPEW_CONTEXT;
Global.scaling = function() {
	return Global.PEWPEW_CANVAS.height / 450;
};

Global.lives_height = function() {
	return 20 * Global.scaling();
};
Global.lives_width = function() {
	return 20 * Global.scaling();
};
Global.intervalLoop = 0;

Global.isSoundEnabled = false;
Global.sound0;
Global.sound1;
Global.sound2;
Global.sound3;
Global.sound4;
Global.sound5;
Global.sound6;
Global.sound7;
Global.sound8;
Global.sound9;
Global.sound10;
Global.sound11;
Global.sound12;
Global.sound13;
Global.sound14;

Global.playSound = function(sound) {
	if (Global.isSoundEnabled) sound.play();
};

Global.mouse = new Mouse();;
Global.bad1;
Global.bad2;
Global.bad3;
Global.good;
Global.boss;
Global.explosion;
Global.laser;
Global.AccelerometerWatcherId;