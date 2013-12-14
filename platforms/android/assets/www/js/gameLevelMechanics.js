/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 function checkLevelFinished() {
    if (badGuys.length == 0 && intervalLoop != 0) {
        setPostLevel();
        return false;
    }
}

/**
 * player has been killed or got a game over
 * optional param str of reason WHY the game ended
 */
function setEndGame(str) {
    if (lives > 1) {
        lives--;
        badGuys.length = 0;
        bullets.length = 0;
        badBullets.length = 0;
        clearInterval(intervalLoop);
        intervalLoop = 0;
        setPreGame();
    } else {
        if (DEBUG) {
            alert("Game Over! because [" + str + "]");
        } else {
            alert("Game Over!");
        }
        lives = PLAYERLIVES;
        level = 1;
        playerScore = 0;
        badGuys.length = 0;
        bullets.length = 0;
        badBullets.length = 0;
        clearInterval(intervalLoop);
        intervalLoop = 0;
        setPreGame();
        sound8.play();
    }
}

function setStartGame() {
    clearInterval(fakeGame); //Clear the pregame
    fakeGame = 0; //Remove pregame interval id
    initGalaga(); //init the game!
}

function setPreGame() {
	if (Constants.DEBUG) console.log("Set pre");
    initPlayer(false);
}

function setPostLevel() {
    level++;
    badBullets.length = 0;
    bullets.length = 0;
    clearInterval(intervalLoop);
    intervalLoop = 0;
    setPreGame();
    delete clonePlayer;
    console.log("set PostLevel");
}

function standByGalaga(){
    if( clonePlayer.y <= player.y ){
        clonePlayer.y +=2;
    }
    if( clonePlayer.x < (player.x + player.width/2) ){ // player is on the right
        if(!stopThere){
            clonePlayer.x -=2;
        }
        if( clonePlayer.x > (player.x + player.width) ){
            stopThere=true;
        }
        if( clonePlayer.y >= player.y && player.x >= (clonePlayer.x+ clonePlayer.width) ){
            completeStandBy();
            stopThere=false;
        }
    }else if ( (player.x + player.width/2) < clonePlayer.x ){ // player is on the left
        if(!stopThere){
            clonePlayer.x +=2;
        }
        if( (clonePlayer.x + clonePlayer.width) < player.x ){
            stopThere=true;
        }
        if( clonePlayer.y >= player.y && (player.x + player.width) <= clonePlayer.x ){
            completeStandBy();
            stopThere=false;
        }
    }else{
        console.log("??");
    }
}

function completeStandBy(){
    console.log("completed merging.");
    isGalagaMerging = false;
    isGalagaMerged = true;
    numOfGalaga = 2;
}