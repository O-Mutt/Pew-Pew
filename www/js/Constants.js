/**
 * Copyright (c) 2012;Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 var Constants = function(){
	var DEBUG = false;//debug flag for helping figure out what is going on
	// CONSTANTS
	var GUYWIDTH = 20;
	var GUYHEIGHT = 20;
	var FIRECHANCEDENOMINATOR = 1000;
	var FIRECHANCENUMERATOR = 998;
	var BULLETHEIGHT = 8;
	var BULLETWIDTH = 2;
	var GUYOFFSET = GUYWIDTH / 2;//player sprite positioned a Global.Global.mouse in center of the image

	var BARRIER_LIFE_LIMIT = 70;
	var LUCKY_LIFE_LIMIT = 50;
	var tmpYPos = 370;
	var tempVimImgY = 0;
	var maxVimImgY = 40;
	var MAXSPIDERCOUNT = 2;
};