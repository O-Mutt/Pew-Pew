/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
/************* Helper methods *************/
/**
 * Intersection of an object with the player
 */
function intersect(obj) {
    if (DEBUG) {
        //console.log("Top [" + obj.top() + "] Bottom [" + obj.bottom() + "] Right [" + obj.right() + "] Left [" + obj.left() + "]");
    }
    if (isGalagaMerged)
//        GALAGA_CONTEXT.drawImage(player.img, player.x - GUYOFFSET*2, player.y - GUYOFFSET, player.height, player.width);
//        GALAGA_CONTEXT.drawImage(player.img, player.x, player.y - GUYOFFSET, player.height, player.width);
        return (obj.left() >= player.x - player.width && player.x + player.width >= obj.right() && obj.top() <= player.y + GUYOFFSET && player.y <= obj.bottom());
    return (obj.left() <= player.x + GUYOFFSET && player.x <= obj.right() && obj.top() <= player.y + GUYOFFSET && player.y <= obj.bottom());
}

/**
 * Check intersections of two objects (a and b)
 */
function intersectOther(a, b) {
    return (a.left() <= b.right() && b.left() <= a.right() && a.top() <= b.bottom() && b.top() <= a.bottom())
} /************* End Helpers *************/