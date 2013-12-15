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
    if (Constants.DEBUG) {
        //console.log("Top [" + obj.top() + "] Bottom [" + obj.bottom() + "] Right [" + obj.right() + "] Left [" + obj.left() + "]");
    }
	
	if (obj) {
		if (Global.isGalagaMerged) {
	//        Global.GALAGA_CONTEXT.drawImage(player.img, player.x - Constants.GUYOFFSET*2, player.y - Constants.GUYOFFSET, player.height, player.width);
	//        Global.GALAGA_CONTEXT.drawImage(player.img, player.x, player.y - Constants.GUYOFFSET, player.height, player.width);
				return (obj.left() >= Game.player.x - Game.player.width && Game.player.x + Game.player.width >= obj.right() && obj.top() <= Game.player.y + GUYOFFSET && Game.player.y <= obj.bottom());
		}
		return (obj.left() <= Game.player.x + Constants.GUYOFFSET && Game.player.x <= obj.right() && obj.top() <= Game.player.y + Constants.GUYOFFSET && Game.player.y <= obj.bottom());
	}
	return false;
}

/**
 * Check intersections of two objects (a and b)
 */
function intersectOther(a, b) {
    return (a.left() <= b.right() && b.left() <= a.right() && a.top() <= b.bottom() && b.top() <= a.bottom())
} /************* End Helpers *************/