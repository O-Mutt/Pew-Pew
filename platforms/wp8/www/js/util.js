/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

/************* Helper methods *************/
/**
 * Check intersections of two objects (a and b)
 */
function intersect(a, b) {
	if (!a || !b) {
		return false;
	}
	var isIntersect = (a.left() <= b.right() && b.left() <= a.right() && a.top() <= b.bottom() && b.top() <= a.bottom());
    if (isIntersect) {
		return isIntersect
	} else {
		return false;
	}
} /************* End Helpers *************/