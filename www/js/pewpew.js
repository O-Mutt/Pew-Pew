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
    if(!Constants.isPewPewMerging && !Constants.isCapturing){
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
            Game.Start();
            Global.mouse.x = 50;
            Redraw.GoodGuy.RedrawPlayer();
        } else {
            var maxBulletsNum = 4;
            if (Global.isPewPewMerged)
                maxBulletsNum *= Global.numOfPewPew;
            if (Global.luckyLife
                || (Global.bullets.length < maxBulletsNum && Global.barrierBullets.length == 0) ){
                if (Global.isPewPewMerged) {
                    Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
                    Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
                } else {
                    Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0));
                }
                Global.playSound(Global.sound11);
            }
        }
    } else if (Game.pressedKeys[88]) { // X - Shot Gun
        if (Global.luckyLife
                || (Global.bullets.length  == 0 && Global.barrierBullets.length == 0)) {
            Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), -1));
            Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), -0.5));
            Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0.5));
            Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 1));
        }
    } else if (Game.pressedKeys[90]) { // Z - Bomb
        if (Global.luckyLife
                || (Global.bullets.length == 0 && Global.barrierBullets.length == 0)) {
            Global.bullets.push(new Bullet(Game.player.centerX(), Game.player.centerY(), (Constants.BULLETHEIGHT * Global.scaling()), (Constants.BULLETWIDTH * Global.scaling() / 2), 0, "bomb"));
        }

    } else if (Game.pressedKeys[67]) { // C - Barrier
        if (Global.luckyLife
                || (Global.barrierBullets.length == 0)) {
            barrierBullet = new Bullet(Game.player.x - Constants.BULLETWIDTH * 20,
                    Game.player.centerY() - 30, Constants.BULLETHEIGHT, Constants.BULLETWIDTH * 40);
            barrierBullet.life = BARRIER_LIFE_LIMIT;
            Global.barrierBullets.push(barrierBullet);
        }
    }
}

function checkPewPewCaptured() {
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
            	var badBullet = new Bullet(
            							badGuy.centerX(),
                						badGuy.bottom(),
                						(Constants.BULLETHEIGHT * Global.scaling()),
                						(Constants.BULLETWIDTH * Global.scaling() / 2),
                						0);
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
                    if( Global.isPewPewMerged ){
                        Global.numOfPewPew--;
                        Global.isPewPewMerged = false;
                    } else {
                        Game.Mechanics.PlayerDead("Game.player is killed by laser");
                    }
			         return false;
                }
            }

            jQuery.each(badGuy.suriArr, function(index, badBullet) {
                if (intersect(Game.player, badBullet)) {
                    Global.PEWPEW_CONTEXT.drawImage(explosion, Game.player.x - Game.player.offset(), Game.player.centerY(), 32, 32);
                    Global.playSound(Global.sound7);
                    if( Global.isPewPewMerged ){
                        Global.numOfPewPew--;
                        Global.isPewPewMerged = false;
                    } else {
                        Game.Mechanics.PlayerDead("Collision with bad suri");
                    }
                    return false;
                }
            });
        }

        jQuery.each(Global.bullets, function(indexBullet, bullet) {
            if (intersect(badGuy, bullet)) {
                if (bullet.bulletType == "bomb") {
                    Global.bullets.push(new Bullet(bullet.x, bullet.y, Constants.BULLETHEIGHT * 5, Constants.BULLETWIDTH * 30, 0, "bomb"));
                }
                if (badGuy.hp == 1) {
                    badGuy.hp--;
                    Game.playerScore += badGuy.points;
                    if ( Global.isCaptured && badGuy.isSpider) {
                        Global.isPewPewMerging = true;
                        Global.isPewPewMerged = false;
                        Global.isCaptured = false;
                        if(!Game.clonePlayer){
                            Game.clonePlayer = new GoodGuy(Global.spider.x, Global.spider.y-(Global.spider.height/2), good, 0, Constants.GUYWIDTH, Constants.GUYHEIGHT, 0, 5);
                        }
                        if(Game.clonePlayer){
                            Game.clonePlayer.x = Global.spider.x;
                            Game.clonePlayer.y = Global.spider.y-(Global.spider.height/2);
                        }
                    }else if (!Global.isCaptured && badGuy.isSpider && (Global.spiderCount <= Constants.MAXSPIDERCOUNT) ){
                        selectSpider();
                    }
                    Global.badGuys.splice(indexGuy, 1);
                    Global.PEWPEW_CONTEXT.drawImage(explosion, badGuy.x, badGuy.y, 32, 32);
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
        if (intersect(Game.player, badBullet)) {
            if (badBullet.bulletType == "lucky") {
                Global.luckyLife += Constants.LUCKY_LIFE_LIMIT;
            }else if ( Global.luckyLife <= 0) {
                if( Global.isPewPewMerged){
                    Global.numOfPewPew--;
                    Global.isPewPewMerged = false;
                } else {
                    Game.Mechanics.PlayerDead("Collision with bad bullet");
                }
            }
            return false;
        }
    });

    jQuery.each(Global.barrierBullets, function(indexBarrierBullet, barrierBullet) {
        jQuery.each(Global.badBullets, function(indexBadBullet, badBullet) {
			if (intersect(badBullet, barrierBullet)) {
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
        if ((badGuy.x + badGuy.width) > $(Global.PEWPEW_CANVAS).width() && badGuy.direction) { //moving right hit a wall?
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
                if (badGuy.y > $(Global.PEWPEW_CANVAS).height/4) {
                    Global.isSpiderMove = true;
                    Global.spider = badGuy;
                    oriPosX = badGuy.x;
                    oriPosY = badGuy.y;
                }
            }
            if (Global.isCaptured) {
                Global.PEWPEW_CONTEXT.drawImage(Game.player.img, badGuy.x, badGuy.centerY()*2, Game.player.scaledHeight, Game.player.width);
            }
        }
    });

    if (isWall) { //hit a wall, gotta reset and move back the other way
        jQuery.each(Global.badGuys, function(index, badGuy) {
            badGuy.velocity = badGuy.velocity + .1;
            if (badGuy.direction) {
                badGuy.y += badGuy.height/2;
                badGuy.x -= badGuy.velocity;
                badGuy.direction = !badGuy.direction;
            } else {
                badGuy.y += badGuy.height/2;
                badGuy.x += badGuy.velocity;
                badGuy.direction = !badGuy.direction;
            }

            //Check if bad guy hit the bottom
            if (Constants.DEBUG) {
				console.log("BadGuy Bottom [" + badGuy.bottom() + "]");
			}
            if (badGuy.bottom() > $(Global.PEWPEW_CANVAS).height) {
                Global.playSound(Global.sound7);
                Game.Mechanics.PlayerDead("Bad guys hit the bottom of the $(Global.PEWPEW_CANVAS)");
                return false;
            }
        });
        isWall = false;
    }
}
