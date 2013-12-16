/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

 function checkLevelFinished() {
    if (Global.badGuys.length == 0 && Global.intervalLoop != 0) {
        setPostLevel();
        return false;
    }
}

/**
 * Game.player has been killed or got a game over
 * optional param str of reason WHY the game ended
 */
function setEndGame(str) {
    if (Game.lives > 1) {
        Game.lives--;
        Global.badGuys.length = 0;
        Global.bullets.length = 0;
        Global.badBullets.length = 0;
        clearInterval(Global.intervalLoop);
        Global.intervalLoop = 0;
        setPreGame();
    } else {
        if (Constants.DEBUG) {
            alert("Game Over! because [" + str + "]");
        } else {
            alert("Game Over!");
        }
        Game.lives = Constants.PLAYERLIVES;
        Game.level = 1;
        Game.playerScore = 0;
        Global.badGuys.length = 0;
        Global.bullets.length = 0;
        Global.badBullets.length = 0;
        clearInterval(Global.intervalLoop);
        Global.intervalLoop = 0;
        setPreGame();
        Global.sound8.play();
    }
}

function setStartGame() {
    clearInterval(Global.fakeGame); //Clear the pregame
    Global.fakeGame = 0; //Remove pregame interval id
    initGalaga(); //init the game!
}

function setPreGame() {
	console.log("Set pre");
    initPlayer(false);
}

function setPostLevel() {
    Game.level++;
    Global.badBullets.length = 0;
    Global.bullets.length = 0;
    clearInterval(Global.intervalLoop);
    Global.intervalLoop = 0;
    setPreGame();
    delete Game.clonePlayer;
    console.log("set PostLevel");
}

function standByGalaga(){
    if( Game.clonePlayer.y <= Game.player.y ){
        Game.clonePlayer.y +=2;
    }
    if( Game.clonePlayer.x < (Game.player.x + Game.player.width/2) ){ // Game.player is on the right
        if(!stopThere){
            Game.clonePlayer.x -=2;
        }
        if( Game.clonePlayer.x > (Game.player.x + Game.player.width) ){
            stopThere=true;
        }
        if( Game.clonePlayer.y >= Game.player.y && Game.player.x >= (Game.clonePlayer.x+ Game.clonePlayer.width) ){
            completeStandBy();
            stopThere=false;
        }
    }else if ( (Game.player.x + Game.player.width/2) < Game.clonePlayer.x ){ // Game.player is on the left
        if(!stopThere){
            Game.clonePlayer.x +=2;
        }
        if( (Game.clonePlayer.x + Game.clonePlayer.width) < Game.player.x ){
            stopThere=true;
        }
        if( Game.clonePlayer.y >= Game.player.y && (Game.player.x + Game.player.width) <= Game.clonePlayer.x ){
            completeStandBy();
            stopThere=false;
        }
    } else {
        console.log("??");
    }
}

function completeStandBy(){
    console.log("completed merging.");
    Global.isGalagaMerging = false;
    Global.isGalagaMerged = true;
    Global.numOfGalaga = 2;
}