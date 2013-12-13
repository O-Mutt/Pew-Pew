var Global = function() {
	//Multiple inits
	var bullets = new Array();//bullets fired by player
	var barrierBullets = new Array();
	var badGuys = new Array();//the bad guys
	var bossFire = new Array();	//Important interval handler!
	var intervalLoop = 0;
	var fakeGame = 0;
	var bulletsControl = {};	
	var luckyLife = 0;
	// for capture
	var isCaptured = false;
	var isCapturing = false;
	var isGalagaMerged = false;
	var isGalagaMerging = false;
	var numOfGalaga = 1;
	var isSpiderMove = false;
	var hasSpider = false;
	var spider;
	var spiderCount = 0;
	var isViming = false;
	var oriPosX;
	var oriPosY;
	var vim;
	
	var canvasHeight;
	var canvasWidth;

	var sound0;
	var sound1;
	var sound2;
	var sound3;
	var sound4;
	var sound5;
	var sound6;
	var sound7;
	var sound8;
	var sound9;
	var sound10;
	var sound11;
	var sound12;
	var sound13;
	var sound14;
	
	var GALAGA_CONTEXT;
	var mouse;
	var bad1;
	var bad2;
	var bad3;
	var good;
	var boss;
	var explosion;
	var laser;
};