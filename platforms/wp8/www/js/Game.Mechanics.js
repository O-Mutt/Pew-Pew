/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 Game.Mechanics = Game.Mechanics || {};

 Game.Mechanics.CheckLevelFinished = function() {
    if (Global.badGuys.length == 0 && Global.intervalLoop != 0) {
        Game.Mechanics.FinishLevel();
        return false;
    }
}

function standByPewPew(){
    if( Game.player.y <= Game.player.y ){
        Game.player.y +=2;
    }
    if( Game.player.x < (Game.player.x + Game.player.width/2) ){ // Game.player is on the right
        if(!stopThere){
            Game.player.x -=2;
        }
        if( Game.player.x > (Game.player.x + Game.player.width) ){
            stopThere=true;
        }
        if( Game.player.y >= Game.player.y && Game.player.x >= (Game.player.x+ Game.player.width) ){
            completeStandBy();
            stopThere=false;
        }
    }else if ( (Game.player.x + Game.player.width/2) < Game.player.x ){ // Game.player is on the left
        if(!stopThere){
            Game.player.x +=2;
        }
        if( (Game.player.x + Game.player.width) < Game.player.x ){
            stopThere=true;
        }
        if( Game.player.y >= Game.player.y && (Game.player.x + Game.player.width) <= Game.player.x ){
            completeStandBy();
            stopThere=false;
        }
    } else {
        console.log("??");
    }
}

function completeStandBy(){
    console.log("completed merging.");
    Global.isPewPewMerging = false;
    Global.isPewPewMerged = true;
    Global.numOfPewPew = 2;
}



Game.Mechanics.ResetLevel = function() {
	Global.badGuys = [];
    Global.bullets = [];
    Global.barrierBullets = [];
    Global.badBullets = [];
	Global.badGuys.length = 0;
	Global.bullets.length = 0;
	Global.badBullets.length = 0;
}

Game.Mechanics.FinishLevel = function() {
    Game.level++;
    clearInterval(Global.intervalLoop);
    Global.intervalLoop = 0;
    Game.Mechanics.CreateTitleScreen();
}

Game.Mechanics.CreateTitleScreen = function() {
	Game.Mechanics.CreatePlayer();
	Global.fakeGame = setInterval(redrawTitleScreen, 20);
}

Game.Mechanics.Start = function() {
	clearInterval(Global.fakeGame); //Clear the pregame
	Global.fakeGame = 0; //Remove pregame interval id

	Game.Mechanics.ResetLevel();
	//Global.PEWPEW_CONTEXT.clearRect(0, 0, Global.PEWPEW_CANVAS.width, Global.PEWPEW_CANVAS.height);

    if (Game.level % 3 != 0) {
        for (var i = 0; i < 10; i++) {
            Global.badGuys.push(new BadGuy(i * (Global.scaling() * Constants.GUYWIDTH + (2 + Global.scaling())),
										0, Global.bad1,	.5, 20,
										1, false, 'bad1'));
        }
        for ( i = 0; i < 10; i++) {
            Global.badGuys.push(new BadGuy(i * (Global.scaling() * Constants.GUYWIDTH + (2 + Global.scaling())),
										Global.scaling() + (1 * (Global.scaling() * Constants.GUYWIDTH + (2 + Global.scaling()))),
										Global.bad2, .5, 10,
										1, false, null));
        }
        for ( i = 0; i < 10; i++) {
            Global.badGuys.push(new BadGuy(i * (Global.scaling() * Constants.GUYWIDTH + (2 + Global.scaling())),
										Global.scaling() + (2 * (Global.scaling() * Constants.GUYWIDTH + (2 + Global.scaling()))),
										Global.bad3, .5, 5,
										1, false, null));
        }
        Global.playSound(Global.sound0);
    } else {
        Constants.FIRECHANCENUMERATOR -= .5;
        Global.badGuys.push(new Boss(1 * 35, 0, Global.boss, .5, 50, 50, Game.level * 100, 10));
    }
    if (!Global.isPewPewMerged) {
        selectSpider();
    }

    Global.intervalLoop = setInterval(drawPewPew, 20);
}
Game.Mechanics.EndGame = function(reason) {
	if (Constants.DEBUG) {
		alert("Game Over! because [" + reason + "]");
	} else {
		alert("Game Over!");
	}
	Game.lives = Game.playerLIVES;
	Game.level = 1;
	Game.playerScore = 0;

	clearInterval(Global.intervalLoop);
	Global.intervalLoop = 0;
	Game.Mechanics.CreateTitleScreen();
	Global.playSound(Global.sound8);
}
Game.Mechanics.EndLevel = function() {
//Do some stuff at the end of a level
}

Game.Mechanics.PlayerDead = function(reason) {
	if (Game.lives > 1) {
		Game.lives--;
		Global.badGuys.length = 0;
		Global.bullets.length = 0;
		Global.badBullets.length = 0;
		clearInterval(Global.intervalLoop);
		Global.intervalLoop = 0;
		Game.Mechanics.CreateTitleScreen();
	} else {
		Game.Mechanics.EndGame(reason);
	}
}

Game.Mechanics.CreatePlayer = function() {
	delete Game.player;
	Game.player = new GoodGuy(Global.PEWPEW_CANVAS.height - (Constants.GUYHEIGHT * Global.scaling()), (Global.PEWPEW_CANVAS.width / 2), Global.good, 0, (Constants.GUYHEIGHT * Global.scaling()), (Constants.GUYWIDTH * Global.scaling()), 0, 5, false, "");
}