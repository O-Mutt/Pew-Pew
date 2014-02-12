/**
 * Copyright (c) 2014, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

/************* Helper methods *************/
/**
 * Check intersections of two objects (a and b)
 */
var Util = Util || {};
Util.intersect = function(a, b) {
	if (!a || !b) {
		return false;
	}
	var isIntersect = (a.left() <= b.right() && b.left() <= a.right() && a.top() <= b.bottom() && b.top() <= a.bottom());
    if (isIntersect) {
		return isIntersect;
	} else {
		return false;
	}
};

Util.checkBadGuyIntersection = function() {
	for(var i = Global.badGuys.length - 1; i >= 0; i--) {
		var badGuy = Global.badGuys[i];
		if (Util.intersect(Game.player, badGuy)) {
			Global.PEWPEW_CONTEXT.drawImage(explosion, Game.player.centerX(), Game.player.centerY(), Game.player.width, Game.player.height);
			Global.playSound(Global.sound7);
			if( Global.isPewPewMerged ){
				Global.numOfPewPew--;
				Global.isPewPewMerged = false;
			} else {
				Game.Mechanics.PlayerDead("Collision in Redraw Player");
			}
		}
	}
};
/************* End Helpers *************/