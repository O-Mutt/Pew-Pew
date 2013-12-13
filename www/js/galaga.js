/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

// diff is array for x diff and y diff.
function processArrow(diff) {
    if (pressedKeys[16]) {
        Global.bulletsControl = diff;
    } else {
        Global.mouse.x += diff[0];
        Global.mouse.y += diff[1];
    }
}

function shoot(){
    jQuery.each(Global.badGuys, function(index, badGuy){
        if(badGuy instanceof Boss){
            badGuy.shoot();
        }
    });
}

function doKeyAction() {
    if(!Constants.isGalagaMerging && !Constants.isCapturing){
        if (Game.pressedKeys[37]) { // left
            if(Global.mouse.x >= Game.player.width) processArrow([-4,0]);
        } else if (Game.pressedKeys[38]) { // up
            processArrow([0,-3]);
        } else if (Game.pressedKeys[39]) { // right
            if (Global.mouse.x <= 400- Game.player.width) processArrow([4,0]);
        } else if (Game.pressedKeys[40]) { // down
            Game.processArrow([0,3]);
        }
    }
    if (Game.pressedKeys[32]) { // space
        Game.pressedKeys[32] = false;
        if (Global.intervalLoop == 0) {
            setStartGame(5);
            Global.mouse.x = 50;
            redrawPlayerGalaga();
        } else {
            var maxBulletsNum = 4;
            if (Global.isGalagaMerged)
                maxBulletsNum *= numOfGalaga;
            if (luckyLife
                || (Global.bullets.length < maxBulletsNum && Global.barrierBullets.length == 0) ){
                if (Global.isGalagaMerged) {
                    Global.bullets.push(new Bullet(Game.player.x - 1 - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                    Global.bullets.push(new Bullet(Game.player.x + 1 + Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                } else {
                    Global.bullets.push(new Bullet(Game.player.x - 1, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                }
                sound11.play();
            }
        }
    } else if (Game.pressedKeys[88]) { // X - Shot Gun
        if (luckyLife
                || (Global.bullets.length  == 0 && Global.barrierBullets.length == 0)) {
            Global.bullets.push(new Bullet(Game.player.x - 15, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, -1));
            Global.bullets.push(new Bullet(Game.player.x - 5, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, -0.5));
            Global.bullets.push(new Bullet(Game.player.x  + 5, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0.5));
            Global.bullets.push(new Bullet(Game.player.x  + 15, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 1));
        }
    } else if (Game.pressedKeys[90]) { // Z - Bomb
        if (luckyLife
                || (Global.bullets.length == 0 && Global.barrierBullets.length == 0)) {
            Global.bullets.push(new Bullet(Game.player.x  + 15, Game.player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0, "bomb"));
        }

    } else if (Game.pressedKeys[67]) { // C - Barrier
        if (luckyLife
                || (Global.barrierBullets.length == 0)) {
            barrierBullet = new Bullet(Game.player.x - Constants.BULLETWIDTH * 20,
                    Game.player.y - Constants.GUYOFFSET - 30, Constants.BULLETHEIGHT, Constants.BULLETWIDTH * 40);
            barrierBullet.life = BARRIER_LIFE_LIMIT;
            Global.barrierBullets.push(barrierBullet);
        }
    }
}



/**
 * Initializes the game
 */
function initGalaga() {
	if (Constants.GALAGA_CONTEXT != undefined) {
		Constants.GALAGA_CONTEXT.clearRect(0, 0, 400, 400);
	}
    Global.badGuys = [];
    Game.player = null;
    Global.Global.bullets = [];
    Global.barrierBullets = [];
    badBullets = [];

    initPlayer(true);
//Guy(x, y, img, velocity, height, width, points, hp, isSpider, type)
    if (level % 3 != 0) {
        for (var i = 0; i < 10; i++) {
            Global.badGuys.push(new Guy(i * 35, 0, bad1, .5, 20, 20, level * 20, 1, false, 'bad1'));
        }
        for ( i = 0; i < 10; i++) {
            Global.badGuys.push(new Guy(i * 35, 30, bad2, .5, 20, 20, level * 10, 1, false, null));
        }
        for ( i = 0; i < 10; i++) {
            Global.badGuys.push(new Guy(i * 35, 60, bad3, .5, 20, 20, level * 5, 1, false, null));
        }
        sound0.play();
    } else {
        Constants.FIRECHANCENUMERATOR -= .5;
        Global.badGuys.push(new Boss(1 * 35, 0, boss, .5, 50, 50, level * 100, 10));
    }
    if (!Global.isGalagaMerged) {
        selectSpider();
    }

    Global.intervalLoop = setInterval(drawGalaga, 20);
}

/**
 * initiallizes the Game.player
 */
function initPlayer(isGame) {
    Global.mouse = new Mouse();
    Game.player = new Guy(0, 0, good, 0, Constants.GUYWIDTH, Constants.GUYHEIGHT, 0, 5);
    if (!isGame) {
        fakeGame = setInterval(drawPreGalaga, 20);
    }
}

/**
 * clears the $(GALAGA_CANVAS) and redraws the Game.player
 */
function drawPreGalaga() {
    //Clean $(GALAGA_CANVAS)
    Constants.GALAGA_CONTEXT.clearRect(0, 0, 400, 400);
    //Move Game.player to Global.mouse
    redrawPlayerGalaga("Click or Space To Start!");
}

/**
 * clears the $(GALAGA_CANVAS) and calls a bunch of helper methods to redraw and check collisions.
 * This method is where most of the "heavy lifting" is done
 */
var sound2PlayCount = 0;
function drawGalaga() {
    //Clean $(GALAGA_CANVAS)
    Constants.GALAGA_CONTEXT.clearRect(0, 0, 400, 400);
    // console.log("->"+isSpiderMove+"->"+isGalagaMerging);
    //Move Game.player to Global.mouse
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
            }else if(Constants.isCapturing){
                if(tempVimImgY >= 0){
                    sound3.play();
                    Constants.GALAGA_CONTEXT.drawImage(vim, spider.x - 24, spider.y + 20, 70, tempVimImgY);
                    tempVimImgY -= 1;
                }
            }else {
                if (sound2PlayCount <= 2){
                    sound2.play();
                    sound2PlayCount++;
                }
                if(tempVimImgY <= maxVimImgY){
                    Constants.GALAGA_CONTEXT.drawImage(vim, spider.x - 24, spider.y + 20, 70, tempVimImgY);
                    tempVimImgY += 1;
                }else{
                    Constants.GALAGA_CONTEXT.drawImage(vim, spider.x - 24, spider.y + 20, 70, maxVimImgY);
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

function checkGalagaCaptured() {
    if (Game.player.x <= spider.x + 20 && Game.player.x >= spider.x - 20) {
        Constants.isCapturing = true;
    }
}

/**
 * Gives the bad guys a chance to fire
 */

var isBossSuriFired = false;

function badGuysTryFire() {
    $.each(Global.badGuys, function(index, badGuy) {
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
                	badGuy.bottom(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0);
            	if 	(Math.random() * 1000 % 100 < 20) {
                	badBullet.bulletType = "lucky";
            	}
            	badBullets.push(badBullet);
        	}
	}
    });
}

function collisionCheckBullets() {
    jQuery.each(Global.badGuys, function(indexGuy, badGuy) {
        if(badGuy instanceof Boss){
            if(badGuy.isFiredLaser && (badGuy.getLaserHeight() + badGuy.top()) > 380){
                if(badGuy.left()+15 < Game.player.right() && badGuy.left()+55 > Game.player.left()){
                    if( Global.isGalagaMerged ){
                        numOfGalaga--;
                        Global.isGalagaMerged = false;
                    }else{
                        setEndGame("Game.player is killed by laser");
                    }
			         return false;
                }
            }

            jQuery.each(badGuy.suriArr, function(index, badBullet) {
                if (badBullet != undefined && intersect(badBullet)) {
                    Constants.GALAGA_CONTEXT.drawImage(explosion, Game.player.x - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, 32, 32);
                    sound7.play();
                    if( isGalagaMerged ){
                        numOfGalaga--;
                        Global.isGalagaMerged = false;
                    }else{
                        setEndGame("Collision with bad suri");
                    }
                    return false;
                }
            });
        }

        jQuery.each(Global.bullets, function(indexBullet, bullet) {
            if ((bullet != undefined && badGuy != undefined) && intersectOther(badGuy, bullet)) {
                if (bullet.bulletType == "bomb") {
                    Global.bullets.push(new Bullet(bullet.x, bullet.y, Constants.BULLETHEIGHT * 5, Constants.BULLETWIDTH * 30, 0, "bomb"));
                }
                if (badGuy.hp == 1) {
                    badGuy.hp--;
                    Game.playerScore += badGuy.points;
                    if ( isCaptured && badGuy.isSpider) {
                        Constants.isGalagaMerging = true;
                        Global.isGalagaMerged = false;
                        Constants.isCaptured = false;
                        if(!clonePlayer){
                            clonePlayer = new Guy(spider.x, spider.y-(spider.height/2), good, 0, GUYWIDTH, GUYHEIGHT, 0, 5);
                        }
                        if(clonePlayer){
                            clonePlayer.x = spider.x;
                            clonePlayer.y = spider.y-(spider.height/2);
                        }
                    }else if (!isCaptured && badGuy.isSpider && (spiderCount <= MAXSPIDERCOUNT) ){
                        selectSpider();
                    }
                    Global.badGuys.splice(indexGuy, 1);
                    Constants.GALAGA_CONTEXT.drawImage(explosion, badGuy.x, badGuy.y, 32, 32);
                    Global.bullets.splice(indexBullet, 1);
                    return false;
                } else {
                    badGuy.hp--;
                    Global.bullets.splice(indexBullet, 1);
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

    jQuery.each(Global.barrierBullets, function(indexBarrierBullet, barrierBullet) {
        jQuery.each(badBullets, function(indexBadBullet, badBullet) {
            if ((badBullet != undefined && barrierBullet != undefined)
                    && intersectOther(badBullet, barrierBullet)) {
                badBullets.splice(indexBadBullet, 1);
                return false;
            }
        });
        if (barrierBullet != undefined && barrierBullet.life-- < 0) {
            Global.barrierBullets.splice(indexBarrierBullet, 1);
        }
    });
}

function moveBadGuys() {
    var isWall = false;
    jQuery.each(Global.badGuys, function(index, badGuy) {
        vel = badGuy.vel;
        if ((badGuy.x + badGuy.width) > $(GALAGA_CANVAS).width() && badGuy.direction) { //moving right hit a wall?
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
                if (badGuy.y > $(GALAGA_CANVAS).height/4) {
                    isSpiderMove = true;
                    spider = badGuy;
                    oriPosX = badGuy.x;
                    oriPosY = badGuy.y;
                }
            }
            if (isCaptured) {
                Constants.GALAGA_CONTEXT.drawImage(Game.player.img, badGuy.x, badGuy.y - Constants.GUYOFFSET*2, Game.player.height, Game.player.width);
            }
        }
    });

    if (isWall) { //hit a wall, gotta reset and move back the other way
        jQuery.each(Global.badGuys, function(index, badGuy) {
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
            if (Constants.DEBUG) {
		console.log("BadGuy Bottom [" + badGuy.bottom() + "] Canvas bottom [" + $(GALAGA_CANVAS).height + "]");
	    }
            if (badGuy.bottom() > $(GALAGA_CANVAS).height) {
                sound7.play();
                setEndGame("Bad guys hit the bottom of the $(GALAGA_CANVAS)");
                return false;
            }
        });
        isWall = false;
    }
}

function setMousePosition(event) {
    var rect = GALAGA_CANVAS.getBoundingClientRect();
    Global.mouse.x = event.clientX - rect.left;
    Global.mouse.y = event.clientY - rect.top;
}
