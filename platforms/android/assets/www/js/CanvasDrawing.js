function redrawTitleScreen() {
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
    redrawPlayerGalaga();
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
                    Global.playSound(Global.sound3);
                    Global.GALAGA_CONTEXT.drawImage(vim, Global.spider.x - 24, Global.spider.y + 20, 70, tempVimImgY);
                    Constants.tempVimImgY -= 1;
                }
            }else {
                if (sound2PlayCount <= 2){
                    Global.playSound(Global.sound2);
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