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
    if (Constants.REDRAW_LOGGING) {
        console.log("Top [" + obj.top() + "] Bottom [" + obj.bottom() + "] Right [" + obj.right() + "] Left [" + obj.left() + "]");
    }
	
	if (obj) {
		if (Global.isGalagaMerged) {
	//        Global.GALAGA_CONTEXT.drawImage(player.img, player.x - Game.player.offset()*2, player.y - Game.player.offset(), player.scaledHeight, player.scaledWidth());
	//        Global.GALAGA_CONTEXT.drawImage(player.img, player.x, player.y - Game.player.offset(), player.scaledHeight, player.scaledWidth());
				return (obj.left() >= Game.player.left() && Game.player.right() >= obj.right() && obj.top() <= Game.player.top() && Game.player.y <= obj.bottom());
		}
		return (obj.left() <= Game.player.right() && Game.player.left() <= obj.right() && obj.top() <= Game.player.bottom() && Game.player.top() <= obj.bottom());
	}
	return false;
}

/**
 * Check intersections of two objects (a and b)
 */
function intersectOther(a, b) {
    return (a.left() <= b.right() && b.left() <= a.right() && a.top() <= b.bottom() && b.top() <= a.bottom())
} /************* End Helpers *************/