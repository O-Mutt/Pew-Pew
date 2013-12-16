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
            if(Global.mouse.x >= Game.player.scaledWidth) processArrow([-4,0]);
        } else if (Game.pressedKeys[38]) { // up
            processArrow([0,-3]);
        } else if (Game.pressedKeys[39]) { // right
            if (Global.mouse.x <= 400- Game.player.scaledWidth) processArrow([4,0]);
        } else if (Game.pressedKeys[40]) { // down
            Game.processArrow([0,3]);
        }
    }
    if (Game.pressedKeys[32]) { // space
        Game.pressedKeys[32] = false;
        if (Global.intervalLoop == 0) {
            Game.Start();
            Global.mouse.x = 50;
            redrawPlayerGalaga();
        } else {
            var maxBulletsNum = 4;
            if (Global.isGalagaMerged)
                maxBulletsNum *= Global.numOfGalaga;
            if (Global.luckyLife
                || (Global.bullets.length < maxBulletsNum && Global.barrierBullets.length == 0) ){
                if (Global.isGalagaMerged) {
                    Global.bullets.push(new Bullet(Game.player.x - 1 - Game.player.offset(), Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                    Global.bullets.push(new Bullet(Game.player.x + 1 + Game.player.offset(), Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                } else {
                    Global.bullets.push(new Bullet(Game.player.x - 1, Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                }
                Global.sound11.play();
            }
        }
    } else if (Game.pressedKeys[88]) { // X - Shot Gun
        if (Global.luckyLife
                || (Global.bullets.length  == 0 && Global.barrierBullets.length == 0)) {
            Global.bullets.push(new Bullet(Game.player.x - 15, Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, -1));
            Global.bullets.push(new Bullet(Game.player.x - 5, Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, -0.5));
            Global.bullets.push(new Bullet(Game.player.x  + 5, Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0.5));
            Global.bullets.push(new Bullet(Game.player.x  + 15, Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 1));
        }
    } else if (Game.pressedKeys[90]) { // Z - Bomb
        if (Global.luckyLife
                || (Global.bullets.length == 0 && Global.barrierBullets.length == 0)) {
            Global.bullets.push(new Bullet(Game.player.x  + 15, Game.player.y - Game.player.offset(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0, "bomb"));
        }

    } else if (Game.pressedKeys[67]) { // C - Barrier
        if (Global.luckyLife
                || (Global.barrierBullets.length == 0)) {
            barrierBullet = new Bullet(Game.player.x - Constants.BULLETWIDTH * 20,
                    Game.player.y - Game.player.offset() - 30, Constants.BULLETHEIGHT, Constants.BULLETWIDTH * 40);
            barrierBullet.life = BARRIER_LIFE_LIMIT;
            Global.barrierBullets.push(barrierBullet);
        }
    }
}



/**
 * Initializes the game
 */
function initGalaga() {
	if (Global.GALAGA_CONTEXT != undefined) {
		Global.GALAGA_CONTEXT.clearRect(0, 0, Global.GALAGA_CANVAS.width, Global.GALAGA_CANVAS.height);
	}
    Global.badGuys = [];
    Game.player = null;
    Global.bullets = [];
    Global.barrierBullets = [];
    Global.badBullets = [];

    initPlayer(true);
//Guy(x, y, img, velocity, height, width, points, hp, isSpider, type)
    if (Game.level % 3 != 0) {
        for (var i = 0; i < 10; i++) {
            Global.badGuys.push(new Guy(i * 35, 0, Global.bad1, .5, 20, 20, Game.level * 20, 1, false, 'bad1'));
        }
        for ( i = 0; i < 10; i++) {
            Global.badGuys.push(new Guy(i * 35, 30, Global.bad2, .5, 20, 20, Game.level * 10, 1, false, null));
        }
        for ( i = 0; i < 10; i++) {
            Global.badGuys.push(new Guy(i * 35, 60, Global.bad3, .5, 20, 20, Game.level * 5, 1, false, null));
        }
        Global.sound0.play();
    } else {
        Constants.FIRECHANCENUMERATOR -= .5;
        Global.badGuys.push(new Boss(1 * 35, 0, Global.boss, .5, 50, 50, Game.level * 100, 10));
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
	if(Constants.DEBUG) console.log("Init Player, real game [" + isGame + "]");
    Global.mouse = new Mouse();
    Game.player = new Guy(0, 0, Global.good, 0, Constants.GUYWIDTH, Constants.GUYWIDTH, 0, 5, false, "");
    if (!isGame) {
        Global.fakeGame = setInterval(drawPreGalaga, 20);
    }
}

/**
 * clears the $(Global.GALAGA_CANVAS) and redraws the Game.player
 */
function drawPreGalaga() {
    //Clean $(Global.GALAGA_CANVAS)
    Global.GALAGA_CONTEXT.clearRect(0, 0, Global.GALAGA_CANVAS.width, Global.GALAGA_CANVAS.height);
    //Move Game.player to Global.mouse
    redrawPlayerGalaga("Click or Space To Start!");
}

/**
 * clears the $(Global.GALAGA_CANVAS) and calls a bunch of helper methods to redraw and check collisions.
 * This method is where most of the "heavy lifting" is done
 */
var sound2PlayCount = 0;
function drawGalaga() {
    //Clean $(Global.GALAGA_CANVAS)
    Global.GALAGA_CONTEXT.clearRect(0, 0, Global.GALAGA_CANVAS.width, Global.GALAGA_CANVAS.height);
    // console.log("->"+isSpiderMove+"->"+isGalagaMerging);
    //Move Game.player to Global.mouse
    redrawPlayerGalaga("");
    if (!Global.isViming)
      collisionCheckBullets();
    if (!Global.isSpiderMove) {
        if(Global.isGalagaMerging){
            redrawBadGuys();
            standByGalaga();
        } else {
            moveBadGuys();
            redrawBadGuys();
            badGuysTryFire();
        }
    } else {
        redrawBadGuys();
        if (!Global.isViming) {
            moveSpider();
        } else {
            checkGalagaCaptured();
            if (Global.isCaptured) {
                goBackSpider();
                sound2PlayCount =0;
            }else if(Global.isCapturing){
                if(Constants.tempVimImgY >= 0){
                    Global.sound3.play();
                    Global.GALAGA_CONTEXT.drawImage(vim, Global.spider.x - 24, Global.spider.y + 20, 70, tempVimImgY);
                    Constants.tempVimImgY -= 1;
                }
            }else {
                if (sound2PlayCount <= 2){
                    Global.sound2.play();
                    sound2PlayCount++;
                }
                if(Constants.tempVimImgY <= maxVimImgY){
                    Global.GALAGA_CONTEXT.drawImage(vim, Global.spider.x - 24, Global.spider.y + 20, 70, Constants.tempVimImgY);
                    Constants.tempVimImgY += 1;
                } else {
                    Global.GALAGA_CONTEXT.drawImage(vim, Global.spider.x - 24, Global.spider.y + 20, 70, Constants.maxVimImgY);
                }
            }
        }

    }
    redrawBullets();
    checkLevelFinished();
    doKeyAction();
    if (Global.luckyLife > 0) {
        Global.luckyLife--;
    }
}

function checkGalagaCaptured() {
    if (Game.player.x <= Global.spider.x + 20 && Game.player.x >= Global.spider.x - 20) {
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

        if (Math.floor(Math.random() * Constants.FIRECHANCEDENOMINATOR) > Constants.FIRECHANCENUMERATOR) {
            if(badGuy instanceof Boss){
                console.log("boss fire!");
                badGuy.startLaser();
                // badGuy.shoot();
            } else {
            	var badBullet = new Bullet(badGuy.x + (badGuy.width / 2),
                	badGuy.bottom(), Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0);
            	if 	(Math.random() * 1000 % 100 < 20) {
                	badBullet.bulletType = "lucky";
            	}
            	Global.badBullets.push(badBullet);
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
                        Global.numOfGalaga--;
                        Global.isGalagaMerged = false;
                    } else {
                        setEndGame("Game.player is killed by laser");
                    }
			         return false;
                }
            }

            jQuery.each(badGuy.suriArr, function(index, badBullet) {
                if (badBullet != undefined && intersect(badBullet)) {
                    Global.GALAGA_CONTEXT.drawImage(explosion, Game.player.x - Game.player.offset(), Game.player.y - Game.player.offset(), 32, 32);
                    Global.sound7.play();
                    if( Global.isGalagaMerged ){
                        Global.numOfGalaga--;
                        Global.isGalagaMerged = false;
                    } else {
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
                    if ( Global.isCaptured && badGuy.isSpider) {
                        Global.isGalagaMerging = true;
                        Global.isGalagaMerged = false;
                        Global.isCaptured = false;
                        if(!Game.clonePlayer){
                            Game.clonePlayer = new Guy(Global.spider.x, Global.spider.y-(Global.spider.height/2), good, 0, Constants.GUYWIDTH, Constants.GUYHEIGHT, 0, 5);
                        }
                        if(Game.clonePlayer){
                            Game.clonePlayer.x = Global.spider.x;
                            Game.clonePlayer.y = Global.spider.y-(Global.spider.height/2);
                        }
                    }else if (!Global.isCaptured && badGuy.isSpider && (Global.spiderCount <= Constants.MAXSPIDERCOUNT) ){
                        selectSpider();
                    }
                    Global.badGuys.splice(indexGuy, 1);
                    Global.GALAGA_CONTEXT.drawImage(explosion, badGuy.x, badGuy.y, 32, 32);
                    Global.bullets.splice(indexBullet, 1);
                    return false;
                } else {
                    badGuy.hp--;
                    Global.bullets.splice(indexBullet, 1);
                }
            }
        });
    });
    jQuery.each(Global.badBullets, function(index, badBullet) {
        if (badBullet != undefined && intersect(badBullet)) {
            if (badBullet.bulletType == "lucky") {
                Global.luckyLife += Constants.LUCKY_LIFE_LIMIT;
            }else if ( Global.luckyLife <= 0) {
                if( Global.isGalagaMerged){
                    Global.numOfGalaga--;
                    Global.isGalagaMerged = false;
                } else {
                    setEndGame("Collision with bad bullet");
                }
            }
            return false;
        }
    });

    jQuery.each(Global.barrierBullets, function(indexBarrierBullet, barrierBullet) {
        jQuery.each(Global.badBullets, function(indexBadBullet, badBullet) {
            if ((badBullet != undefined && barrierBullet != undefined)
                    && intersectOther(badBullet, barrierBullet)) {
                Global.badBullets.splice(indexBadBullet, 1);
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
        if ((badGuy.x + badGuy.width) > $(Global.GALAGA_CANVAS).width() && badGuy.direction) { //moving right hit a wall?
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
            if (!Global.isSpiderMove && !Global.isCaptured) {
                if (badGuy.y > $(Global.GALAGA_CANVAS).height/4) {
                    Global.isSpiderMove = true;
                    Global.spider = badGuy;
                    oriPosX = badGuy.x;
                    oriPosY = badGuy.y;
                }
            }
            if (Global.isCaptured) {
                Global.GALAGA_CONTEXT.drawImage(Game.player.img, badGuy.x, badGuy.y - Game.player.offset()*2, Game.player.scaledHeight, Game.player.scaledWidth);
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
		console.log("BadGuy Bottom [" + badGuy.bottom() + "] Canvas bottom [" + $(Global.GALAGA_CANVAS).height + "]");
	    }
            if (badGuy.bottom() > $(Global.GALAGA_CANVAS).height) {
                Global.sound7.play();
                setEndGame("Bad guys hit the bottom of the $(Global.GALAGA_CANVAS)");
                return false;
            }
        });
        isWall = false;
    }
}

function setMousePosition(event) {
    var rect = Global.GALAGA_CANVAS.getBoundingClientRect();
    Global.mouse.x = event.clientX - rect.left;
    Global.mouse.y = event.clientY - rect.top;
}
