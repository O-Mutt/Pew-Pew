/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 function redrawPlayerGalaga(str) {
    if(!Constants.isCapturing && !Global.isGalagaMerging){
        if(Global.mouse.x < Game.player.width) Game.player.x = Game.player.width;
        else if(Global.mouse.x > 400- Game.player.width) Game.player.x = 400- Game.player.width;
        else Game.player.x = Global.mouse.x;
    }
    if (Options.gameTypeClassic) {
        Game.player.y = Constants.canvasHeight - 20;
    } else {
        Game.player.y = Global.mouse.y;
    }
    if (Global.luckLife > 0) {
        Constants.GALAGA_CONTEXT.fillStyle = "GRAY";
        Constants.GALAGA_CONTEXT.fillRect(0, 350, Constants.canvasWidth, Constants.canvasHeight); //X, Y, width, height
        Constants.GALAGA_CONTEXT.fillStyle = "Black";
        Constants.GALAGA_CONTEXT.fillText("GOD MODE!" + Global.luckLife, 20, Constants.canvasHeight - 30);
    }
    if (Constants.isCapturing) {
        tmpYPos -= 2;
        Constants.GALAGA_CONTEXT.drawImage(Game.player.img, spider.x, tmpYPos - Constants.GUYOFFSET, Game.player.height, Game.player.width);
        if ( tmpYPos <= spider.y-(spider.height/2) ) {
            Constants.isCapturing = false;
            isCaptured = true;
        }

    }else if (Global.isGalagaMerging){
        Constants.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
        // if(!clonePlayer){
        //     clonePlayer = new Guy(spider.x, spider.y-(spider.height/2), good, 0, GUYWIDTH, GUYHEIGHT, 0, 5);
        // }
        Constants.GALAGA_CONTEXT.drawImage(Game.player.img, clonePlayer.x - Constants.GUYOFFSET, clonePlayer.y - Constants.GUYOFFSET, clonePlayer.height, clonePlayer.width);
    }else if (Global.isGalagaMerged) {
            Constants.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x - Constants.GUYOFFSET*2, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
            Constants.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
    }else{
            Constants.GALAGA_CONTEXT.drawImage(Game.player.img, Game.player.x - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, Game.player.height, Game.player.width);
    }



    Constants.GALAGA_CONTEXT.fillStyle = "White";
    Constants.GALAGA_CONTEXT.fillText("PlayerScore: [" + Game.playerScore + "] Level: [" + Game.level + "] " + str, 20, Constants.canvasHeight - 10);
    for (var i = 1; i < Game.lives; i++) {
        Constants.GALAGA_CONTEXT.drawImage(Game.player.img, Constants.canvasWidth - (i * 17), Constants.canvasHeight - 20, 15, 15);
    }
    if (Constants.DEBUG) {
        //Write other things about the Game.player
    }

    if (Game.player != undefined && Game.player.x != undefined && Global.badGuys) {
        $.each(Global.badGuys, function(index, badGuy) {
            if (intersect(badGuy)) {
                Constants.GALAGA_CONTEXT.drawImage(explosion, Game.player.x - Constants.GUYOFFSET, Game.player.y - Constants.GUYOFFSET, 32, 32);
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

function redrawBadGuys() {
    $.each(Global.badGuys, function(index, badGuy) {
        if (Constants.DEBUG) {
            Constants.GALAGA_CONTEXT.fillStyle = "White";
            Constants.GALAGA_CONTEXT.fillText("HP: [" + badGuy.hp + "]", badGuy.x, badGuy.y - 2);
        }
        Constants.GALAGA_CONTEXT.drawImage(badGuy.img, badGuy.x, badGuy.y, badGuy.width, badGuy.height);
    });
}

function redrawBullets() {
    //My fired bullets
    $.each(bullets, function(index, bullet) {
        if (bullet != undefined) {
            bullet.y -= 3 + (level * 0.1); //Move bullet up
            bullet.x += bullet.xdiff;

            bullet.x += bulletsControl[0];
            bullet.y += bulletsControl[1];

            Constants.GALAGA_CONTEXT.fillStyle = "White";
            Constants.GALAGA_CONTEXT.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); //X, Y, width, height
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        }
    });
    bulletsControl = [0,0];

    //Bad guy bullets
    $.each(badBullets, function(index, badBullet) {
        if (badBullet != undefined) {
            badBullet.y += 3+ (level * 0.1);  //Move bullet up
            if (badBullet.bulletType == "lucky") {
                Constants.GALAGA_CONTEXT.fillStyle = "Green";
            } else {
                Constants.GALAGA_CONTEXT.fillStyle = "White";
            }
            Constants.GALAGA_CONTEXT.fillRect(badBullet.x, badBullet.y, badBullet.width, badBullet.height); //X, Y, width, height
            if (badBullet.y > $(GALAGA_CANVAS).height) {
                badBullets.splice(index, 1);
            }
        }
    });

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
                        Constants.GALAGA_CONTEXT.drawImage(laser, badGuy.x - Constants.GUYOFFSET+15, start - Constants.GUYOFFSET+60, 40, 24);    
                    }
                }
                
            }

            $.each(badGuy.suriArr, function(index, suri){
                try{
                    suri.move();

                    if(suri.right()<0 || suri.left()>400 || suri.top() > 400){
                        badGuy.suriArr.splice(index, 1);
                       console.log("suri removed->"+index);
                    }else{
//                        console.log("suri draw->"+index+"["+suri.left()+","+suri.top()+"]");
                        Constants.GALAGA_CONTEXT.drawImage(suri.img, suri.left(), suri.top(), 15, 15);    
                    }
                }catch(e){
                    console.log("suri error->"+suri);
                }
                
            });
	}
});
    //Barrier bullets
    $.each(barrierBullets, function(index, barrierBullet) {
        if (barrierBullet != undefined) {
            Constants.GALAGA_CONTEXT.fillStyle = "Blue";
            Constants.GALAGA_CONTEXT.fillRect(barrierBullet.x, barrierBullet.y,
                barrierBullet.width, barrierBullet.height); //X, Y, width, height
        }
    });
}