/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

 function redrawPlayerGalaga(str) {	
    if(!Constants.isCapturing && !Global.isGalagaMerging){
        if(Global.mouse.x < Game.player.width) Game.player.x = Game.player.width;
        else if(Global.mouse.x > Global.GALAGA_CANVAS.width - Game.player.width) Game.player.x = Global.GALAGA_CANVAS.width - Game.player.width;
        else Game.player.x = Global.mouse.x;
    }
    if (Options.gameTypeClassic) {
        Game.player.y = Global.GALAGA_CANVAS.height - 20;
    } else {
        Game.player.y = Global.mouse.y;
    }
    if (Global.luckLife > 0) {
        Global.GALAGA_CONTEXT.fillStyle = "GRAY";
        Global.GALAGA_CONTEXT.fillRect(0, 350, Global.GALAGA_CANVAS.width, Global.GALAGA_CANVAS.height); //X, Y, width, height
        Global.GALAGA_CONTEXT.fillStyle = "Black";
        Global.GALAGA_CONTEXT.fillText("GOD MODE!" + Global.luckLife, 20, Global.GALAGA_CANVAS.height - 30);
    }
    if (Constants.isCapturing) {
        tmpYPos -= 2;
        Global.GALAGA_CONTEXT.drawImage(Game.player.img, Global.spider.x, tmpYPos - Constants.GUYOFFSET, Game.player.height, Game.player.width);
        if ( tmpYPos <= Global.spider.y-(Global.spider.height/2) ) {
            Constants.isCapturing = false;
            isCaptured = true;
        }

    } else if (Global.isGalagaMerging) {
        Global.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
        // if(!clonePlayer){
        //     clonePlayer = new Guy(Global.spider.x, Global.spider.y-(Global.spider.height/2), good, 0, GUYWIDTH, GUYHEIGHT, 0, 5);
        // }
        Global.GALAGA_CONTEXT.drawImage(Game.player.img, clonePlayer.x - Constants.GUYOFFSET, clonePlayer.y - Constants.GUYOFFSET, clonePlayer.height, clonePlayer.width);
    } else if (Global.isGalagaMerged) {
		Global.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x - Constants.GUYOFFSET*2, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
		Global.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
    } else {
		Global.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
    }



    Global.GALAGA_CONTEXT.fillStyle = "White";
    Global.GALAGA_CONTEXT.fillText("PlayerScore: [" + Game.playerScore + "] Level: [" + Game.level + "] " + str, 20, Global.GALAGA_CANVAS.height - 10);
    for (var i = 1; i < Game.lives; i++) {
        Global.GALAGA_CONTEXT.drawImage(Game.player.img, Global.GALAGA_CANVAS.width - (i * 17), Global.GALAGA_CANVAS.height - 20, 15, 15);
    }
    if (Constants.DEBUG) {
        //Write other things about the Game.player
    }

    if (Game.player != undefined && Game.player.x != undefined && Global.badGuys) {
        $.each(Global.badGuys, function(index, badGuy) {
            if (intersect(badGuy)) {
                Global.GALAGA_CONTEXT.drawImage(explosion, Game.player.x - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, 32, 32);
                Global.sound7.play();
                if( Global.isGalagaMerged ){
                    Global.numOfGalaga--;
                    Global.isGalagaMerged = false;
                } else {
                    setEndGame("Collision in Redraw Player");
                }
            }
        });
    }
}

function redrawBadGuys() {
	if (Constants.DEBUG) console.log("redraw badGuys");
    $.each(Global.badGuys, function(index, badGuy) {
        if (Constants.DEBUG) {
            Global.GALAGA_CONTEXT.fillStyle = "White";
            Global.GALAGA_CONTEXT.fillText("HP: [" + badGuy.hp + "]", badGuy.x, badGuy.y - 2);
        }
        Global.GALAGA_CONTEXT.drawImage(badGuy.img, badGuy.x, badGuy.y, badGuy.width, badGuy.height);
    });
}

function redrawBullets() {
	if (Constants.DEBUG) console.log("redraw bullets");
    redrawPlayerBullets();
    redrawBadGuyBullets();
    redrawBarrierBullets();
}

function redrawBadGuyBullets() {
	//Bad guy bullets
    $.each(Global.badBullets, function(index, badBullet) {
        if (badBullet != undefined) {
            badBullet.y += 3+ (Game.level * 0.1);  //Move bullet up
            if (badBullet.bulletType == "lucky") {
                Global.GALAGA_CONTEXT.fillStyle = "Green";
            } else {
                Global.GALAGA_CONTEXT.fillStyle = "White";
            }
            Global.GALAGA_CONTEXT.fillRect(badBullet.x, badBullet.y, badBullet.width, badBullet.height); //X, Y, width, height
            if (badBullet.y > $(Global.GALAGA_CANVAS).height) {
                Global.badBullets.splice(index, 1);
            }
        }
    });

	//? what does this do?
    $.each(Global.badGuys, function(index, badGuy){
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
                        Global.GALAGA_CONTEXT.drawImage(laser, badGuy.x - Constants.GUYOFFSET+15, start - Constants.GUYOFFSET+60, 40, 24);    
                    }
                }
                
            }

            $.each(badGuy.suriArr, function(index, suri){
                try{
                    suri.move();

                    if(suri.right() < 0 || suri.left() > Global.GALAGA_CANVAS.width || suri.top() > Global.GALAGA_CANVAS.height){
                        badGuy.suriArr.splice(index, 1);
                       console.log("suri removed -> " + index);
                    } else {
//                        console.log("suri draw->"+index+"["+suri.left()+","+suri.top()+"]");
                        Global.GALAGA_CONTEXT.drawImage(suri.img, suri.left(), suri.top(), 15, 15);    
                    }
                }catch(e){
                    console.log("suri error -> " + suri);
                }
                
            });
		}
	});
}

function redrawBarrierBullets() {
    $.each(Global.barrierBullets, function(index, barrierBullet) {
        if (barrierBullet != undefined) {
            Global.GALAGA_CONTEXT.fillStyle = "Blue";
            Global.GALAGA_CONTEXT.fillRect(barrierBullet.x, barrierBullet.y,
                barrierBullet.width, barrierBullet.height); //X, Y, width, height
        }
    });
}

function redrawPlayerBullets() {
	$.each(Global.bullets, function(index, bullet) {
        if (bullet != undefined) {
            bullet.y -= 3 + (Game.level * 0.1); //Move bullet up
            bullet.x += bullet.xdiff;

            bullet.x += bulletsControl[0];
            bullet.y += bulletsControl[1];

            Global.GALAGA_CONTEXT.fillStyle = "White";
            Global.GALAGA_CONTEXT.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); //X, Y, width, height
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        }
    });
    bulletsControl = [0,0];
}
	