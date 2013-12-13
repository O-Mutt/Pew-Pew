/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 function redrawPlayerGalaga(str) {
    if(!Constants.isCapturing && !Constants.isGalagaMerging){
        if(mouse.x < player.width) player.x = player.width;
        else if(mouse.x > 400- player.width) player.x = 400- player.width;
        else player.x = mouse.x;
    }
    if (gameTypeClassic) {
        player.y = Constants.canvasHeight - 20;
    } else {
        player.y = mouse.y;
    }
    if (luckyLife > 0) {
        Constants.GALAGA_CONTEXT.fillStyle = "GRAY";
        Constants.GALAGA_CONTEXT.fillRect(0, 350, Constants.canvasWidth, Constants.canvasHeight); //X, Y, width, height
        Constants.GALAGA_CONTEXT.fillStyle = "Black";
        Constants.GALAGA_CONTEXT.fillText("GOD MODE!" + luckyLife, 20, Constants.canvasHeight - 30);
    }
    if (Constants.isCapturing) {
        tmpYPos -= 2;
        Constants.GALAGA_CONTEXT.drawImage(player.img, spider.x, tmpYPos - GUYOFFSET, player.height, player.width);
        if ( tmpYPos <= spider.y-(spider.height/2) ) {
            Constants.isCapturing = false;
            isCaptured = true;
        }

    }else if (Constants.isGalagaMerging){
        Constants.GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET, player.y - GUYOFFSET, player.height, player.width);
        // if(!clonePlayer){
        //     clonePlayer = new Guy(spider.x, spider.y-(spider.height/2), good, 0, GUYWIDTH, GUYHEIGHT, 0, 5);
        // }
        Constants.GALAGA_CONTEXT.drawImage(player.img, clonePlayer.x - GUYOFFSET, clonePlayer.y - GUYOFFSET, clonePlayer.height, clonePlayer.width);
    }else if (isGalagaMerged) {
            Constants.GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET*2, player.y - GUYOFFSET, player.height, player.width);
            Constants.GALAGA_CONTEXT.drawImage(player.img, player.x, player.y - GUYOFFSET, player.height, player.width);
    }else{
            Constants.GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET, player.y - GUYOFFSET, player.height, player.width);
    }



    Constants.GALAGA_CONTEXT.fillStyle = "White";
    Constants.GALAGA_CONTEXT.fillText("PlayerScore: [" + playerScore + "] Level: [" + level + "] " + str, 20, Constants.canvasHeight - 10);
    for (var i = 1; i < lives; i++) {
        Constants.GALAGA_CONTEXT.drawImage(player.img, Constants.canvasWidth - (i * 17), Constants.canvasHeight - 20, 15, 15);
    }
    if (DEBUG) {
        //Write other things about the player
    }

    if (player != undefined && player.x != undefined) {
        $.each(badGuys, function(index, badGuy) {
            if (intersect(badGuy)) {
                Constants.GALAGA_CONTEXT.drawImage(explosion, player.x - GUYOFFSET, player.y - GUYOFFSET, 32, 32);
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
    $.each(badGuys, function(index, badGuy) {
        if (DEBUG) {
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

    $.each(badGuys, function(index, badGuy){
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
                        Constants.GALAGA_CONTEXT.drawImage(laser, badGuy.x - GUYOFFSET+15, start - GUYOFFSET+60, 40, 24);    
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