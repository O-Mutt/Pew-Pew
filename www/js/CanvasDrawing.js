Redraw.Canvas = Redraw.Canvas || {};

Redraw.Canvas.redrawTitleScreen = function() {
    //Clean $(Global.PEWPEW_CANVAS)
    Global.PEWPEW_CONTEXT.clearRect(0, 0, Global.PEWPEW_CANVAS.width, Global.PEWPEW_CANVAS.height);
    //Move Game.player to Global.mouse
    Redraw.GoodGuy.RedrawPlayerPregame();
};

/**
 * clears the $(Global.PEWPEW_CANVAS) and calls a bunch of helper methods to redraw and check collisions.
 * This method is where most of the "heavy lifting" is done
 */
var sound2PlayCount = 0;
Redraw.Canvas.DrawPewPew = function() {
    //Clean $(Global.PEWPEW_CANVAS)
    Global.PEWPEW_CONTEXT.clearRect(0, 0, Global.PEWPEW_CANVAS.width, Global.PEWPEW_CANVAS.height);
    // console.log("->"+isSpiderMove+"->"+isPewPewMerging);
    //Move Game.player to Global.mouse
    Redraw.GoodGuy.RedrawPlayer();
    if (!Global.isViming)
      collisionCheckBullets();
    if (!Global.isSpiderMove) {
        if(Global.isPewPewMerging){
            Redraw.BadGuys.redrawBadGuys();
            standByPewPew();
        } else {
            moveBadGuys();
            Redraw.BadGuys.redrawBadGuys();
            badGuysTryFire();
        }
    } else {
        Redraw.BadGuys.redrawBadGuys();
        if (!Global.isViming) {
            moveSpider();
        } else {
            checkPewPewCaptured();
            if (Global.isCaptured) {
                goBackSpider();
                sound2PlayCount =0;
            }else if(Global.isCapturing){
                if(Constants.tempVimImgY >= 0){
                    Global.playSound(Global.sound3);
                    Global.PEWPEW_CONTEXT.drawImage(vim, Global.spider.x - 24, Global.spider.y + 20, 70, tempVimImgY);
                    Constants.tempVimImgY -= 1;
                }
            }else {
                if (sound2PlayCount <= 2){
                    Global.playSound(Global.sound2);
                    sound2PlayCount++;
                }
                if(Constants.tempVimImgY <= maxVimImgY){
                    Global.PEWPEW_CONTEXT.drawImage(vim, Global.spider.x - 24, Global.spider.y + 20, 70, Constants.tempVimImgY);
                    Constants.tempVimImgY += 1;
                } else {
                    Global.PEWPEW_CONTEXT.drawImage(vim, Global.spider.x - 24, Global.spider.y + 20, 70, Constants.maxVimImgY);
                }
            }
        }

    }
    Redraw.Bullets.redrawBullets();
    Game.Mechanics.CheckLevelFinished();
    doKeyAction();
    if (Global.luckyLife > 0) {
        Global.luckyLife--;
    }
};