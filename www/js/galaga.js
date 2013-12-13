/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

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
    lives = Constants.PLAYERLIVES;

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
    $(GALAGA_CANVAS).ondragstart = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
    };

// do nothing in the event handler except canceling the event
    $(GALAGA_CANVAS).onselectstart = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
    };
    
    $(GALAGA_CANVAS).on('click', function(e) {
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
                  bullets.push(new Bullet(player.x - 1 - Constants.GUYOFFSET, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                  bullets.push(new Bullet(player.x + 1 + Constants.GUYOFFSET, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
              } else {
              bullets.push(new Bullet(player.x - 1, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
              }
              sound11.play();
          }
      }
      return false;

    });
    
    //Mouse listener
    $(GALAGA_CANVAS).mousemove(function(event) {
        setMousePosition(event);
    });

    $(GALAGA_CANVAS).keydown(function(event) {
        if (event.which == 32 && intervalLoop == 0) {
            setStartGame(5);
            mouse.x = 50;
            redrawPlayerGalaga();
        }
        if (!Constants.isCapturing){
            pressedKeys[event.which] = true;
            // console.log(event.which)
        }
        return false;
    });

    $(GALAGA_CANVAS).keyup(function(event) {
        pressedKeys[event.which] = false;
    });
}

function shoot(){
    jQuery.each(Constants.badGuys, function(index, badGuy){
        if(badGuy instanceof Boss){
            badGuy.shoot();
        }
    });
}

function doKeyAction() {
    if(!Constants.isGalagaMerging && !Constants.isCapturing){
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
                    bullets.push(new Bullet(player.x - 1 - Constants.GUYOFFSET, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                    bullets.push(new Bullet(player.x + 1 + Constants.GUYOFFSET, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                }else {
                    bullets.push(new Bullet(player.x - 1, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0));
                }
                sound11.play();
            }
        }
    } else if (pressedKeys[88]) { // X - Shot Gun
        if (luckyLife
                || (bullets.length  == 0 && barrierBullets.length == 0)) {
            bullets.push(new Bullet(player.x - 15, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, -1));
            bullets.push(new Bullet(player.x - 5, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, -0.5));
            bullets.push(new Bullet(player.x  + 5, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0.5));
            bullets.push(new Bullet(player.x  + 15, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 1));
        }
    } else if (pressedKeys[90]) { // Z - Bomb
        if (luckyLife
                || (bullets.length == 0 && barrierBullets.length == 0)) {
            bullets.push(new Bullet(player.x  + 15, player.y - Constants.GUYOFFSET, Constants.BULLETHEIGHT, Constants.BULLETWIDTH, 0, "bomb"));
        }

    } else if (pressedKeys[67]) { // C - Barrier
        if (luckyLife
                || (barrierBullets.length == 0)) {
            barrierBullet = new Bullet(player.x - Constants.BULLETWIDTH * 20,
                    player.y - Constants.GUYOFFSET - 30, Constants.BULLETHEIGHT, Constants.BULLETWIDTH * 40);
            barrierBullet.life = BARRIER_LIFE_LIMIT;
            barrierBullets.push(barrierBullet);
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
    Constants.badGuys = [];
    player = null;
    bullets = [];
    barrierBullets = [];
    badBullets = [];

    initPlayer(true);
//Guy(x, y, img, velocity, height, width, points, hp, isSpider, type)
    if (level % 3 != 0) {
        for (var i = 0; i < 10; i++) {
            Constants.badGuys.push(new Guy(i * 35, 0, bad1, .5, 20, 20, level * 20, 1, false, 'bad1'));
        }
        for ( i = 0; i < 10; i++) {
            Constants.badGuys.push(new Guy(i * 35, 30, bad2, .5, 20, 20, level * 10, 1, false, null));
        }
        for ( i = 0; i < 10; i++) {
            Constants.badGuys.push(new Guy(i * 35, 60, bad3, .5, 20, 20, level * 5, 1, false, null));
        }
        sound0.play();
    } else {
        Constants.FIRECHANCENUMERATOR -= .5;
        Constants.badGuys.push(new Boss(1 * 35, 0, boss, .5, 50, 50, level * 100, 10));
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
    Constants.player = new Guy(0, 0, good, 0, Constants.GUYWIDTH, Constants.GUYHEIGHT, 0, 5);
    if (!isGame) {
        fakeGame = setInterval(drawPreGalaga, 20);
    }
}

/**
 * clears the $(GALAGA_CANVAS) and redraws the player
 */
function drawPreGalaga() {
    //Clean $(GALAGA_CANVAS)
    Constants.GALAGA_CONTEXT.clearRect(0, 0, 400, 400);
    //Move player to mouse
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
    if (player.x <= spider.x + 20 && player.x >= spider.x - 20) {
        Constants.isCapturing = true;
    }
}

/**
 * Gives the bad guys a chance to fire
 */

var isBossSuriFired = false;

function badGuysTryFire() {
    $.each(Constants.badGuys, function(index, badGuy) {
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
    jQuery.each(Constants.badGuys, function(indexGuy, badGuy) {
        if(badGuy instanceof Boss){
            if(badGuy.isFiredLaser && (badGuy.getLaserHeight() + badGuy.top()) > 380){
                if(badGuy.left()+15 < player.right() && badGuy.left()+55 > player.left()){
                    if( isGalagaMerged ){
                        numOfGalaga--;
                        Constants.isGalagaMerged = false;
                    }else{
                        setEndGame("player is killed by laser");
                    }
			         return false;
                }
            }

            jQuery.each(badGuy.suriArr, function(index, badBullet) {
                if (badBullet != undefined && intersect(badBullet)) {
                    Constants.GALAGA_CONTEXT.drawImage(explosion, player.x - Constants.GUYOFFSET, player.y - Constants.GUYOFFSET, 32, 32);
                    sound7.play();
                    if( isGalagaMerged ){
                        numOfGalaga--;
                        Constants.isGalagaMerged = false;
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
                    bullets.push(new Bullet(bullet.x, bullet.y, Constants.BULLETHEIGHT * 5, Constants.BULLETWIDTH * 30, 0, "bomb"));
                }
                if (badGuy.hp == 1) {
                    badGuy.hp--;
                    playerScore += badGuy.points;
                    if ( isCaptured && badGuy.isSpider) {
                        Constants.isGalagaMerging = true;
                        Constants.isGalagaMerged = false;
                        Constants.isCaptured = false;
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
                    Constants.badGuys.splice(indexGuy, 1);
                    Constants.GALAGA_CONTEXT.drawImage(explosion, badGuy.x, badGuy.y, 32, 32);
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

function moveBadGuys() {
    var isWall = false;
    jQuery.each(Constants.badGuys, function(index, badGuy) {
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
                Constants.GALAGA_CONTEXT.drawImage(player.img, badGuy.x, badGuy.y - Constants.GUYOFFSET*2, player.height, player.width);
            }
        }
    });

    if (isWall) { //hit a wall, gotta reset and move back the other way
        jQuery.each(Constants.badGuys, function(index, badGuy) {
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
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}
