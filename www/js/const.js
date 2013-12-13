/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 var DEBUG = false; //debug flag for helping figure out what is going on
//One time inits
var GALAGA_CONTEXT;
var mouse;
var bad1, bad2, bad3, good, boss, explosion, laser;
// CONSTANTS
var GUYWIDTH = 20;
var GUYHEIGHT = 20;
var FIRECHANCEDENOMINATOR = 1000;
var FIRECHANCENUMERATOR = 998;
var BULLETHEIGHT = 8;
var BULLETWIDTH = 2;
var GUYOFFSET = GUYWIDTH / 2; //player sprite positioned a mouse in center of the image
var PLAYERLIVES = 5;
//Game counters
var playerScore = 0;
var level = 1;
var lives;
var stopThere = false;

var sound0, sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8, sound9, sound10, sound11, sound12, sound13, sound14;

//options
var gameTypeClassic;

//Multiple inits
var player;
var clonePlayer;
var bullets = new Array(); //bullets fired by player
var barrierBullets = new Array();
var badGuys = new Array(); //the bad guys

var bossFire = new Array();
//Important interval handler!
var intervalLoop = 0;
var fakeGame = 0;

var pressedKeys = {};
var bulletsControl = {};

var BARRIER_LIFE_LIMIT = 70;

var luckyLife = 0;
var LUCKY_LIFE_LIMIT = 50;

// for capture
var isCaptured = false;
var isCapturing = false;
var isGalagaMerged = false;
var isGalagaMerging = false;
var numOfGalaga = 1;
var isSpiderMove = false;
var hasSpider = false;
var spider;
var isSpiderCount = 0;
var isSpiderMaxCount = 2;
var isViming = false;
var tmpYPos = 370;
var oriPosX;
var oriPosY;
var vim;
var tempVimImgY = 0;
var maxVimImgY = 40;