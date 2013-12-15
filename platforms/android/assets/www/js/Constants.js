/**
 * Copyright (c) 2012;Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

var Constants = new function(){
	this.DEBUG = true;//debug flag for helping figure out what is going on
	// CONSTANTS
	this.GUYWIDTH = 20;
	this.GUYHEIGHT = 20;
	this.FIRECHANCEDENOMINATOR = 1000;
	this.FIRECHANCENUMERATOR = 998;
	this.BULLETHEIGHT = 8;
	this.BULLETWIDTH = 2;
	this.GUYOFFSET = this.GUYWIDTH / 2;//player sprite positioned a Global.mouse in center of the image

	this.BARRIER_LIFE_LIMIT = 70;
	this.LUCKY_LIFE_LIMIT = 50;
	this.tmpYPos = 370;
	this.tempVimImgY = 0;
	this.maxVimImgY = 40;
	this.MAXSPIDERCOUNT = 2;
};