/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
var DEBUG = false; //debug flag for helping figure out what is going on
//One time inits
var $GALAGA_CANVAS;
var GALAGA_CANVAS;
var GALAGA_CONTEXT;
var mouse;
var bad1; //bad guy sprite 1
var bad2; //bad guy sprite 2
var bad3; //bad guy sprite 3
var good; //the GOOD GUY!
var boss;
var explosion; //the GOOD GUY!
var laser;
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

/*document ready function */
jQuery(document).ready(function($){
    //jquery GALAGA_CANVAS wrapper
    $GALAGA_CANVAS = $("#galaga_canvas");
    //html GALAGA_CANVAS object
    GALAGA_CANVAS = $GALAGA_CANVAS[0];
    //html5 context of the GALAGA_CANVAS
    GALAGA_CONTEXT = GALAGA_CANVAS.getContext("2d");

    //Can't access jquery $ outside of scope
    sound0 = $('#sound0')[0];
    sound1 = $('#sound1')[0];
    sound2 = $('#sound2')[0];
    sound3 = $('#sound3')[0];
    sound4 = $('#sound4')[0];
    sound5 = $('#sound5')[0];
    sound6 = $('#sound6')[0];
    sound7 = $('#sound7')[0];
    sound8 = $('#sound8')[0];
    sound9 = $('#sound9')[0];
    sound10 = $('#sound10')[0];
    sound11 = $('#sound11')[0];
    sound12 = $('#sound12')[0];
    sound13 = $('#sound13')[0];
    sound14 = $('#sound14')[0];


   /* jQuery("#classicOrFree").dialog({
        resizable: false,
        height: 140,
        modal: true,
        buttons: {
            "Classic": function() {
                gameTypeClassic = true;
                ready();
                jQuery(this).dialog("close");
            },
            "Free-Flight": function() {
                gameTypeClassic = false;
                ready();
                jQuery(this).dialog("close");
            }
        }
    });*/
	gameTypeClassic = true;
	ready();
});

// diff is array for x diff and y diff.
function processArrow(diff) {
    if (pressedKeys[16]) {
        bulletsControl = diff;
    } else {
        mouse.x += diff[0];
        mouse.y += diff[1];
    }
}

function ready() {

    //Game wide options
    lives = PLAYERLIVES;

    //page images
    bad1 = document.getElementById("bad1");
    bad2 = document.getElementById("bad2");
    bad3 = document.getElementById("bad3");
    good = document.getElementById("good");
    boss = document.getElementById("boss");
    laser = document.getElementById("laser");
    explosion = document.getElementById("explosion");
    vim = document.getElementById("vim");
    //Sets up the pregame to show the good ship and message to start
    setPreGame();

    // do nothing in the event handler except canceling the event
    GALAGA_CANVAS.ondragstart = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
    };

// do nothing in the event handler except canceling the event
    GALAGA_CANVAS.onselectstart = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
    };
    
    $GALAGA_CANVAS.on('click', function(e) {
      e.preventDefault();

      if (intervalLoop == 0) {
        sound9.play();
        setStartGame(5);
      } else {
          var maxBulletsNum = 4;
          if (isGalagaMerged)
              maxBulletsNum *= numOfGalaga;
          if (bullets.length < maxBulletsNum) {
              if (isGalagaMerged) {
                  bullets.push(new Bullet(player.x - 1 - GUYOFFSET, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0));
                  bullets.push(new Bullet(player.x + 1 + GUYOFFSET, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0));
              } else {
              bullets.push(new Bullet(player.x - 1, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0));
              }
              sound11.play();
          }
      }
      return false;

    });
    
    //Mouse listener
    jQuery($GALAGA_CANVAS).mousemove(function(event) {
        setMousePosition(event);
    });

    jQuery($GALAGA_CANVAS).keydown(function(event) {
        if (event.which == 32 && intervalLoop == 0) {
            setStartGame(5);
            mouse.x = 50;
            redrawPlayerGalaga();
        }
        if (!isCapturing){
            pressedKeys[event.which] = true;
            // console.log(event.which)
        }
        return false;
    });

    jQuery($GALAGA_CANVAS).keyup(function(event) {
        pressedKeys[event.which] = false;
    });
}

function shoot(){
    jQuery.each(badGuys, function(index, badGuy){
        if(badGuy instanceof Boss){
            badGuy.shoot();
        }
    });
}

function doKeyAction() {
    if(!isGalagaMerging && !isCapturing){
        if (pressedKeys[37]) { // left
            if(mouse.x >= player.width) processArrow([-4,0]);
        } else if (pressedKeys[38]) { // up
            processArrow([0,-3]);
        } else if (pressedKeys[39]) { // right
            if (mouse.x <= 400- player.width) processArrow([4,0]);
        } else if (pressedKeys[40]) { // down
            processArrow([0,3]);
        }
    }
    if (pressedKeys[32]) { // space
        pressedKeys[32] = false;
        if (intervalLoop == 0) {
            setStartGame(5);
            mouse.x = 50;
            redrawPlayerGalaga();
        } else {
            var maxBulletsNum = 4;
            if (isGalagaMerged)
                maxBulletsNum *= numOfGalaga;
            if (luckyLife
                || (bullets.length < maxBulletsNum && barrierBullets.length == 0) ){
                if (isGalagaMerged) {
                    bullets.push(new Bullet(player.x - 1 - GUYOFFSET, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0));
                    bullets.push(new Bullet(player.x + 1 + GUYOFFSET, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0));
                }else {
                    bullets.push(new Bullet(player.x - 1, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0));
                }
                sound11.play();
            }
        }
    } else if (pressedKeys[88]) { // X - Shot Gun
        if (luckyLife
                || (bullets.length  == 0 && barrierBullets.length == 0)) {
            bullets.push(new Bullet(player.x - 15, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, -1));
            bullets.push(new Bullet(player.x - 5, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, -0.5));
            bullets.push(new Bullet(player.x  + 5, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0.5));
            bullets.push(new Bullet(player.x  + 15, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 1));
        }
    } else if (pressedKeys[90]) { // Z - Bomb
        if (luckyLife
                || (bullets.length == 0 && barrierBullets.length == 0)) {
            bullets.push(new Bullet(player.x  + 15, player.y - GUYOFFSET, BULLETHEIGHT, BULLETWIDTH, 0, "bomb"));
        }

    } else if (pressedKeys[67]) { // C - Barrier
        if (luckyLife
                || (barrierBullets.length == 0)) {
            barrierBullet = new Bullet(player.x - BULLETWIDTH * 20,
                    player.y - GUYOFFSET - 30, BULLETHEIGHT, BULLETWIDTH * 40);
            barrierBullet.life = BARRIER_LIFE_LIMIT;
            barrierBullets.push(barrierBullet);
        }
    }
}

function selectSpider(){
    do{
        var idx = Math.floor(Math.random() * 100) % badGuys.length;
        if(badGuys[idx].type){
            var type = badGuys[idx].cusType();
            var a = badGuys[idx].top();
        }
        //badGuys[idx].height ;
        //badGuys[idx].width += 2;
//        alert(badGuys.length + '   '+idx+ '   '+type+ '   '+a )
    }while(type != 'bad1');
    badGuys[idx].isSpider = true;
}

/**
 * Initiallizes the game
 */
function initGalaga() {
	if (GALAGA_CONTEXT != undefined) {
		GALAGA_CONTEXT.clearRect(0, 0, 400, 400);
	}
    badGuys = [];
    player = null;
    bullets = [];
    barrierBullets = [];
    badBullets = [];

    initPlayer(true);
//Guy(x, y, img, velocity, height, width, points, hp, isSpider, type)
    if (level % 3 != 0) {
        for (var i = 0; i < 10; i++) {
            badGuys.push(new Guy(i * 35, 0, bad1, .5, 20, 20, level * 20, 1, false, 'bad1'));
        }
        for ( i = 0; i < 10; i++) {
            badGuys.push(new Guy(i * 35, 30, bad2, .5, 20, 20, level * 10, 1, false, null));
        }
        for ( i = 0; i < 10; i++) {
            badGuys.push(new Guy(i * 35, 60, bad3, .5, 20, 20, level * 5, 1, false, null));
        }
        sound0.play();
    } else {
        FIRECHANCENUMERATOR -= .5;
        badGuys.push(new Boss(1 * 35, 0, boss, .5, 50, 50, level * 100, 10));
    }
    if (!isGalagaMerged) {
        selectSpider();
    }

    intervalLoop = setInterval(drawGalaga, 20);
}

/**
 * initiallizes the player
 */
function initPlayer(isGame) {
    mouse = new Mouse();
    player = new Guy(0, 0, good, 0, GUYWIDTH, GUYHEIGHT, 0, 5);
    if (!isGame) {
        fakeGame = setInterval(drawPlayerGalaga, 20);
    }
}

/**
 * clears the GALAGA_CANVAS and redraws the player
 */
function drawPlayerGalaga() {
    //Clean GALAGA_CANVAS
    GALAGA_CONTEXT.clearRect(0, 0, 400, 400);
    //Move player to mouse
    redrawPlayerGalaga("Click or Space To Start!");
}

/**
 * clears the GALAGA_CANVAS and calls a bunch of helper methods to redraw and check collisions.
 * This method is where most of the "heavy lifting" is done
 */
var sound2PlayCount = 0;
function drawGalaga() {
    //Clean GALAGA_CANVAS
    GALAGA_CONTEXT.clearRect(0, 0, 400, 400);
    // console.log("->"+isSpiderMove+"->"+isGalagaMerging);
    //Move player to mouse
    redrawPlayerGalaga("");
    if (!isViming)
      collisionCheckBullets();
    if (!isSpiderMove) {
        if(isGalagaMerging){
            redrawBadGuys();
            standByGalaga();
        }else{
            moveBadGuys();
            redrawBadGuys();
            badGuysTryFire();
        }
    }else{
        redrawBadGuys();
        if (!isViming) {
            moveSpider();
        } else {
            checkGalagaCaptured();
            if (isCaptured) {
                goBackSpider();
                sound2PlayCount =0;
            }else if(isCapturing){
                if(tempVimImgY >= 0){
                    sound3.play();
                    GALAGA_CONTEXT.drawImage(vim, spider.x - 24, spider.y + 20, 70, tempVimImgY);
                    tempVimImgY -= 1;
                }
            }else {
                if (sound2PlayCount <= 2){
                    sound2.play();
                    sound2PlayCount++;
                }
                if(tempVimImgY <= maxVimImgY){
                    GALAGA_CONTEXT.drawImage(vim, spider.x - 24, spider.y + 20, 70, tempVimImgY);
                    tempVimImgY += 1;
                }else{
                    GALAGA_CONTEXT.drawImage(vim, spider.x - 24, spider.y + 20, 70, maxVimImgY);
                }
            }
        }

    }
    redrawBullets();
    checkLevelFinished();
    doKeyAction();
    if (luckyLife > 0) {
        luckyLife--;
    }
}
function completeStandBy(){
    console.log("completed merging.");
    isGalagaMerging = false;
    isGalagaMerged = true;
    numOfGalaga = 2;
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

function goBackSpider() {
    if( spider.y > oriPosY ){
        spider.y -= 2;
    }else{
        isSpiderMove = false;
        isViming = false;
        player.x = GALAGA_CANVAS.width/2;
        player.y = 370;
    }

}
function checkGalagaCaptured() {
    if (player.x <= spider.x + 20 && player.x >= spider.x - 20) {
        isCapturing = true;
    }
}

/**
 * Gives the bad guys a chance to fire
 */

var isBossSuriFired = false;

function badGuysTryFire() {
    jQuery.each(badGuys, function(index, badGuy) {
        //Chance to fire
        if(badGuy instanceof Boss && !isBossSuriFired){
            badGuy.shoot();
            setInterval("shoot()",1000);    
            isBossSuriFired = true;
        }

        if (Math.floor(Math.random() * FIRECHANCEDENOMINATOR) > FIRECHANCENUMERATOR) {
            if(badGuy instanceof Boss){
                console.log("boss fire!");
                badGuy.startLaser();
                // badGuy.shoot();
            }else{
            	var badBullet = new Bullet(badGuy.x + (badGuy.width / 2),
                	badGuy.bottom(), BULLETHEIGHT, BULLETWIDTH, 0);
            	if 	(Math.random() * 1000 % 100 < 20) {
                	badBullet.bulletType = "lucky";
            	}
            	badBullets.push(badBullet);
        	}
	}
    });
}


function redrawPlayerGalaga(str) {
    if(!isCapturing && !isGalagaMerging){
        if(mouse.x < player.width) player.x = player.width;
        else if(mouse.x > 400- player.width) player.x = 400- player.width;
        else player.x = mouse.x;
    }
    if (gameTypeClassic) {
        player.y = 370;
    } else {
        player.y = mouse.y;
    }
    if (luckyLife > 0) {
        GALAGA_CONTEXT.fillStyle = "GRAY";
        GALAGA_CONTEXT.fillRect(0, 350, 400, 400); //X, Y, width, height
        GALAGA_CONTEXT.fillStyle = "Black";
        GALAGA_CONTEXT.fillText("GOD MODE!" + luckyLife, 20, 370);
    }
    if (isCapturing) {
        tmpYPos -= 2;
        GALAGA_CONTEXT.drawImage(player.img, spider.x, tmpYPos - GUYOFFSET, player.height, player.width);
        if ( tmpYPos <= spider.y-(spider.height/2) ) {
            isCapturing = false;
            isCaptured = true;
        }

    }else if (isGalagaMerging){
        GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET, player.y - GUYOFFSET, player.height, player.width);
        // if(!clonePlayer){
        //     clonePlayer = new Guy(spider.x, spider.y-(spider.height/2), good, 0, GUYWIDTH, GUYHEIGHT, 0, 5);
        // }
        GALAGA_CONTEXT.drawImage(player.img, clonePlayer.x - GUYOFFSET, clonePlayer.y - GUYOFFSET, clonePlayer.height, clonePlayer.width);
    }else if (isGalagaMerged) {
            GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET*2, player.y - GUYOFFSET, player.height, player.width);
            GALAGA_CONTEXT.drawImage(player.img, player.x, player.y - GUYOFFSET, player.height, player.width);
    }else{
            GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET, player.y - GUYOFFSET, player.height, player.width);
    }



    GALAGA_CONTEXT.fillStyle = "White";
    GALAGA_CONTEXT.fillText("PlayerScore: [" + playerScore + "] Level: [" + level + "] " + str, 20, 390);
    for (var i = 1; i < lives; i++) {
        GALAGA_CONTEXT.drawImage(player.img, 390 - (i * 17), 380, 15, 15);
    }
    if (DEBUG) {
        //Write other things about the player
    }

    if (player != undefined && player.x != undefined) {
        jQuery.each(badGuys, function(index, badGuy) {
            if (intersect(badGuy)) {
                GALAGA_CONTEXT.drawImage(explosion, player.x - GUYOFFSET, player.y - GUYOFFSET, 32, 32);
                sound7.play();
                if( isGalagaMerged ){
                    numOfGalaga--;
                    isGalagaMerged = false;
                }else{
                    setEndGame("Collision in Redraw Player");
                }
                return false;
            }
        });
    }
}


function collisionCheckBullets() {
    jQuery.each(badGuys, function(indexGuy, badGuy) {
        if(badGuy instanceof Boss){
            if(badGuy.isFiredLaser && (badGuy.getLaserHeight() + badGuy.top()) > 380){
                if(badGuy.left()+15 < player.right() && badGuy.left()+55 > player.left()){
                    if( isGalagaMerged ){
                        numOfGalaga--;
                        isGalagaMerged = false;
                    }else{
                        setEndGame("player is killed by laser");
                    }
			         return false;
                }
            }

            jQuery.each(badGuy.suriArr, function(index, badBullet) {
                if (badBullet != undefined && intersect(badBullet)) {
                    GALAGA_CONTEXT.drawImage(explosion, player.x - GUYOFFSET, player.y - GUYOFFSET, 32, 32);
                    sound7.play();
                    if( isGalagaMerged ){
                        numOfGalaga--;
                        isGalagaMerged = false;
                    }else{
                        setEndGame("Collision with bad suri");
                    }
                    return false;
                }
            });
        }

        jQuery.each(bullets, function(indexBullet, bullet) {
            if ((bullet != undefined && badGuy != undefined) && intersectOther(badGuy, bullet)) {
                if (bullet.bulletType == "bomb") {
                    bullets.push(new Bullet(bullet.x, bullet.y, BULLETHEIGHT * 5, BULLETWIDTH * 30, 0, "bomb"));
                }
                if (badGuy.hp == 1) {
                    badGuy.hp--;
                    playerScore += badGuy.points;
                    if ( isCaptured && badGuy.isSpider) {
                        isGalagaMerging = true;
                        isGalagaMerged = false;
                        isCaptured = false;
                        if(!clonePlayer){
                            clonePlayer = new Guy(spider.x, spider.y-(spider.height/2), good, 0, GUYWIDTH, GUYHEIGHT, 0, 5);
                        }
                        if(clonePlayer){
                            clonePlayer.x = spider.x;
                            clonePlayer.y = spider.y-(spider.height/2);
                        }
                    }else if (!isCaptured && badGuy.isSpider && (isSpiderCount <= isSpiderMaxCount) ){
                        selectSpider();
                    }
                    badGuys.splice(indexGuy, 1);
                    GALAGA_CONTEXT.drawImage(explosion, badGuy.x, badGuy.y, 32, 32);
                    bullets.splice(indexBullet, 1);
                    return false;
                } else {
                    badGuy.hp--;
                    bullets.splice(indexBullet, 1);
                }
            }
        });
    });
    jQuery.each(badBullets, function(index, badBullet) {
        if (badBullet != undefined && intersect(badBullet)) {
            if (badBullet.bulletType == "lucky") {
                luckyLife += LUCKY_LIFE_LIMIT;
            }else if ( luckyLife <= 0) {
                if( isGalagaMerged){
                    numOfGalaga--;
                    isGalagaMerged = false;
                }else{
                    setEndGame("Collision with bad bullet");
                }
            }
            return false;
        }
    });

    jQuery.each(barrierBullets, function(indexBarrierBullet, barrierBullet) {
        jQuery.each(badBullets, function(indexBadBullet, badBullet) {
            if ((badBullet != undefined && barrierBullet != undefined)
                    && intersectOther(badBullet, barrierBullet)) {
                badBullets.splice(indexBadBullet, 1);
                return false;
            }
        });
        if (barrierBullet != undefined && barrierBullet.life-- < 0) {
            barrierBullets.splice(indexBarrierBullet, 1);
        }
    });
}

function moveSpider() {
    if (spider.y < (GALAGA_CANVAS.height*4)/5) {
        spider.y += 2;
    } else {
        isViming = true;
    }
}
function moveBadGuys() {
    var isWall = false;
    jQuery.each(badGuys, function(index, badGuy) {
        vel = badGuy.vel;
        if ((badGuy.x + badGuy.width) > $GALAGA_CANVAS.width() && badGuy.direction) { //moving right hit a wall?
            isWall = true;
            badGuy.x += badGuy.velocity;
        } else if (badGuy.x < 0 && !badGuy.direction) { //moving left hit a wall?
            isWall = true;
            badGuy.x -= badGuy.velocity;
        } else { //no walls GO
            if (badGuy.direction) { //right
                badGuy.x += badGuy.velocity;
            } else { //left
                badGuy.x -= badGuy.velocity;
            }
        }
        if (badGuy.isSpider) {
            if (!isSpiderMove && !isCaptured) {
                if (badGuy.y > GALAGA_CANVAS.height/4) {
                    isSpiderMove = true;
                    spider = badGuy;
                    oriPosX = badGuy.x;
                    oriPosY = badGuy.y;
                }
            }
            if (isCaptured) {
                GALAGA_CONTEXT.drawImage(player.img, badGuy.x, badGuy.y - GUYOFFSET*2, player.height, player.width);
            }
        }
    });

    if (isWall) { //hit a wall, gotta reset and move back the other way
        jQuery.each(badGuys, function(index, badGuy) {
            badGuy.velocity = badGuy.velocity + .1;
            if (badGuy.direction) {
                badGuy.y += 15;
                badGuy.x -= badGuy.velocity;
                badGuy.direction = !badGuy.direction;
            } else {
                badGuy.y += 15;
                badGuy.x += badGuy.velocity;
                badGuy.direction = !badGuy.direction;
            }

            //Check if bad guy hit the bottom
            if (DEBUG) {
		console.log("BadGuy Bottom [" + badGuy.bottom() + "] Canvas bottom [" + GALAGA_CANVAS.height + "]");
	    }
            if (badGuy.bottom() > GALAGA_CANVAS.height) {
                sound7.play();
                setEndGame("Bad guys hit the bottom of the GALAGA_CANVAS");
                return false;
            }
        });
        isWall = false;
    }
}

function redrawBadGuys() {
    jQuery.each(badGuys, function(index, badGuy) {
        if (DEBUG) {
            GALAGA_CONTEXT.fillStyle = "White";
            GALAGA_CONTEXT.fillText("HP: [" + badGuy.hp + "]", badGuy.x, badGuy.y - 2);
        }
        GALAGA_CONTEXT.drawImage(badGuy.img, badGuy.x, badGuy.y, badGuy.width, badGuy.height);
    });
}

function redrawBullets() {
    //My fired bullets
    jQuery.each(bullets, function(index, bullet) {
        if (bullet != undefined) {
            bullet.y -= 3 + (level * 0.1); //Move bullet up
            bullet.x += bullet.xdiff;

            bullet.x += bulletsControl[0];
            bullet.y += bulletsControl[1];

            GALAGA_CONTEXT.fillStyle = "White";
            GALAGA_CONTEXT.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); //X, Y, width, height
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        }
    });
    bulletsControl = [0,0];

    //Bad guy bullets
    jQuery.each(badBullets, function(index, badBullet) {
        if (badBullet != undefined) {
            badBullet.y += 3+ (level * 0.1);  //Move bullet up
            if (badBullet.bulletType == "lucky") {
                GALAGA_CONTEXT.fillStyle = "Green";
            } else {
                GALAGA_CONTEXT.fillStyle = "White";
            }
            GALAGA_CONTEXT.fillRect(badBullet.x, badBullet.y, badBullet.width, badBullet.height); //X, Y, width, height
            if (badBullet.y > $GALAGA_CANVAS.height) {
                badBullets.splice(index, 1);
            }
        }
    });

    jQuery.each(badGuys, function(index, badGuy){
        if(badGuy instanceof Boss){
            if(badGuy.isFiredLaser){

                var startLaser = badGuy.top();
                var endLaser = (badGuy.top() + badGuy.increaseLaserHeight());
//                console.log("laser fire-->"+endLaser);
                

                if(endLaser >= 2000){
                    badGuy.stopLaser();
                } else{
                    if(endLaser >= 400){
                        endLaser = 400;
                    }
                    for(start = startLaser;start<=endLaser;start++){
                        GALAGA_CONTEXT.drawImage(laser, badGuy.x - GUYOFFSET+15, start - GUYOFFSET+60, 40, 24);    
                    }
                }
                
            }

            jQuery.each(badGuy.suriArr, function(index, suri){
                try{
                    suri.move();

                    if(suri.right()<0 || suri.left()>400 || suri.top() > 400){
                        badGuy.suriArr.splice(index, 1);
                       console.log("suri removed->"+index);
                    }else{
//                        console.log("suri draw->"+index+"["+suri.left()+","+suri.top()+"]");
                        GALAGA_CONTEXT.drawImage(suri.img, suri.left(), suri.top(), 15, 15);    
                    }
                }catch(e){
                    console.log("suri error->"+suri);
                }
                
            });
	}
});
    //Barrier bullets

    jQuery.each(barrierBullets, function(index, barrierBullet) {
        if (barrierBullet != undefined) {
            GALAGA_CONTEXT.fillStyle = "Blue";
            GALAGA_CONTEXT.fillRect(barrierBullet.x, barrierBullet.y,
                barrierBullet.width, barrierBullet.height); //X, Y, width, height
        }
    });
}

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

function setMousePosition(event) {
    var rect = GALAGA_CANVAS.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}

/************* Objects *************/
/**
 * Bullets fired
 */
function Bullet(x, y, height, width, xdiff, bulletType) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.xdiff = xdiff;
    this.bulletType = bulletType;

    this.top = function() {
        return this.y;
    };
    this.bottom = function() {
        return this.y + this.height;
    };
    this.left = function() {
        return this.x;
    };
    this.right = function() {
        return this.x + this.width;
    };
}

function Mouse() {
    this.x;
    this.y;
}

/**
 * Any moving object that can collide with a bullet
 */
function Guy(x, y, img, velocity, height, width, points, hp, isSpider, type) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.direction = true; //true is right, false is left
    this.points = points;
    this.hp = hp;
    this.isSpider = isSpider;
    this.type = type;

    this.top = function() {
        return this.y;
    };
    this.bottom = function() {
        return this.y + this.height;
    };
    this.left = function() {
        return this.x;
    };
    this.right = function() {
        return this.x + this.width;
    };
    this.cusType = function() {
        return this.type;
    };
} /************* End Objects *************/
/************* Helper methods *************/
/**
 * Intersection of an object with the player
 */
function intersect(obj) {
    if (DEBUG) {
        //console.log("Top [" + obj.top() + "] Bottom [" + obj.bottom() + "] Right [" + obj.right() + "] Left [" + obj.left() + "]");
    }
    if (isGalagaMerged)
//        GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET*2, player.y - GUYOFFSET, player.height, player.width);
//        GALAGA_CONTEXT.drawImage(player.img, player.x, player.y - GUYOFFSET, player.height, player.width);
        return (obj.left() >= player.x - player.width && player.x + player.width >= obj.right() && obj.top() <= player.y + GUYOFFSET && player.y <= obj.bottom());
    return (obj.left() <= player.x + GUYOFFSET && player.x <= obj.right() && obj.top() <= player.y + GUYOFFSET && player.y <= obj.bottom());
}

/**
 * Check intersections of two objects (a and b)
 */
function intersectOther(a, b) {
    return (a.left() <= b.right() && b.left() <= a.right() && a.top() <= b.bottom() && b.top() <= a.bottom())
} /************* End Helpers *************/
