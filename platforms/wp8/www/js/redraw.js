/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

 function redrawPlayerPewPew(str) {
    if (Global.luckLife > 0) {
        Global.PEWPEW_CONTEXT.fillStyle = "GRAY";
        Global.PEWPEW_CONTEXT.fillRect(0, 350, Global.PEWPEW_CANVAS.width, Global.PEWPEW_CANVAS.height); //X, Y, width, height
        Global.PEWPEW_CONTEXT.fillStyle = "Black";
        Global.PEWPEW_CONTEXT.fillText("GOD MODE!" + Global.luckLife, 20, Global.PEWPEW_CANVAS.height - Game.player.height);
    }
    if (Constants.isCapturing) {
        tmpYPos -= 2;
        Global.PEWPEW_CONTEXT.drawImage(Game.player.img, Global.spider.x, tmpYPos - Game.player.offset(), Game.player.width, Game.player.height);
        if ( tmpYPos <= Global.spider.y-(Global.spider.height/2) ) {
            Constants.isCapturing = false;
            isCaptured = true;
        }

    } else if (Global.isPewPewMerging) {
        Global.PEWPEW_CONTEXT.drawImage(Game.player.img, Game.player.centerX(), Game.player.centerY(), Game.player.width, Game.player.height);
        // if(!clonePlayer){
        //     clonePlayer = new GoodGuy(Global.spider.x, Global.spider.y-(Global.spider.height/2), good, 0, Constants.GUYWIDTH, Constants.GUYHEIGHT, 0, 5);
        // }
        Global.PEWPEW_CONTEXT.drawImage(Game.player.img, clonePlayer.centerX(), clonePlayer.centerY(), cloneplayer.width, cloneplayer.height);
    } else if (Global.isPewPewMerged) {
		Global.PEWPEW_CONTEXT.drawImage(Game.player.img, Game.player.x - Game.player.offset() * 2, Game.player.y - Game.player.offset(), Game.player.width, Game.player.height);
		Global.PEWPEW_CONTEXT.drawImage(Game.player.img, Game.player.centerX(), Game.player.centerY(), Game.player.width, Game.player.height);
    } else {
		Global.PEWPEW_CONTEXT.drawImage(Game.player.img, Game.player.centerX(), Game.player.centerY(),  Game.player.width, Game.player.height);
    }



    Global.PEWPEW_CONTEXT.fillStyle = "White";
	Global.PEWPEW_CONTEXT.font = 20 * Global.scaling() + "px sans-serif";
	if (str) { 
		Global.PEWPEW_CONTEXT.fillText("PlayerScore: [" + Game.playerScore + "] Level: [" + Game.level + "] " + str, 10, Global.PEWPEW_CANVAS.height - 10, Global.PEWPEW_CANVAS.width / 3);
	} else {
		Global.PEWPEW_CONTEXT.fillText("PlayerScore: [" + Game.playerScore + "] Level: [" + Game.level + "]", 10, Global.PEWPEW_CANVAS.height - 10, Global.PEWPEW_CANVAS.width / 3);
	}
    for (var i = 1; i < Game.lives; i++) {
        Global.PEWPEW_CONTEXT.drawImage(Game.player.img, Global.PEWPEW_CANVAS.width - (i * Global.lives_width()), Global.PEWPEW_CANVAS.height - (Global.lives_height() + 5), Global.lives_height(), Global.lives_width());
    }
    if (Constants.DEBUG) {
        //Write other things about the Game.player
    }

	checkBadGuyIntersection();
}

function redrawBadGuys() {
	if (Constants.REDRAW_LOGGING) console.log("redraw badGuys");
    $.each(Global.badGuys, function(index, badGuy) {
        if (Constants.DEBUG) {
            Global.PEWPEW_CONTEXT.fillStyle = "White";
			Global.PEWPEW_CONTEXT.font = 5 * Global.scaling() + "px sans-serif";
            Global.PEWPEW_CONTEXT.fillText("HP: [" + badGuy.hp + "]", badGuy.x, badGuy.y - 2);
        }
        Global.PEWPEW_CONTEXT.drawImage(badGuy.img, badGuy.x, badGuy.y, badGuy.width, badGuy.height);
    });
}

function redrawBullets() {
	if (Constants.REDRAW_LOGGING) console.log("redraw bullets");
    redrawPlayerBullets();
    redrawBadGuyBullets();
    redrawBarrierBullets();
}

function redrawBadGuyBullets() {
	//Bad guy bullets
    $.each(Global.badBullets, function(index, badBullet) {
        if (badBullet != undefined) {
            badBullet.y += (2 * Global.scaling()) + (Game.level * 0.1);  //Move bullet up
            if (badBullet.bulletType == "lucky") {
                Global.PEWPEW_CONTEXT.fillStyle = "Green";
            } else {
                Global.PEWPEW_CONTEXT.fillStyle = "White";
            }
            Global.PEWPEW_CONTEXT.fillRect(badBullet.x, badBullet.y, badBullet.width, badBullet.height); //X, Y, width, height
            if (badBullet.y > $(Global.PEWPEW_CANVAS).height) {
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
                    for(start = startLaser; start <= endLaser; start++) {
                        Global.PEWPEW_CONTEXT.drawImage(laser, badGuy.x - badGuy.offset() + 15, start - badGuy.offset() + 60, 40, 24);    
                    }
                }
                
            }

            $.each(badGuy.suriArr, function(index, suri){
                try{
                    suri.move();

                    if(suri.right() < 0 || suri.left() > Global.PEWPEW_CANVAS.width || suri.top() > Global.PEWPEW_CANVAS.height){
                        badGuy.suriArr.splice(index, 1);
                       console.log("suri removed -> " + index);
                    } else {
//                        console.log("suri draw->"+index+"["+suri.left()+","+suri.top()+"]");
                        Global.PEWPEW_CONTEXT.drawImage(suri.img, suri.left(), suri.top(), 15, 15);    
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
            Global.PEWPEW_CONTEXT.fillStyle = "Blue";
            Global.PEWPEW_CONTEXT.fillRect(barrierBullet.x, barrierBullet.y,
                barrierBullet.width, barrierBullet.height); //X, Y, width, height
        }
    });
}

function redrawPlayerBullets() {
	$.each(Global.bullets, function(index, bullet) {
        if (bullet != undefined) {
            bullet.y -= (2 * Global.scaling()) + (Game.level * 0.1); //Move bullet up
            bullet.x += bullet.xdiff;

            bullet.x += bulletsControl[0];
            bullet.y += bulletsControl[1];

            Global.PEWPEW_CONTEXT.fillStyle = "White";
            Global.PEWPEW_CONTEXT.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); //X, Y, width, height
            if (bullet.y < 0) {
                Global.bullets.splice(index, 1);
            }
        }
    });
    bulletsControl = [0,0];
}
	