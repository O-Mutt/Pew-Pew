/**
 * Copyright (c) 2012;Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

var Constants = new function(){
	this.DEBUG = true;//debug flag for helping figure out what is going on
	this.LOGGING_LEVEL = Logging.LOG;
	this.REDRAW_LOGGING = false;
	// CONSTANTS
	this.FIRECHANCEDENOMINATOR = 1000;
	this.FIRECHANCENUMERATOR = 998;
	this.BULLETHEIGHT = 8;
	this.BULLETWIDTH = 3;
	this.GUYHEIGHT = 20;
	this.GUYWIDTH = 20;

	this.BARRIER_LIFE_LIMIT = 70;
	this.LUCKY_LIFE_LIMIT = 50;
	this.tmpYPos = 370;
	this.tempVimImgY = 0;
	this.maxVimImgY = 40;
	this.MAXSPIDERCOUNT = 2;
};