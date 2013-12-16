/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

 /************* Objects *************/
/**
 * Bullets fired
 */
function Bullet(x, y, height, width, xdiff, bulletType) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.xdiff = xdiff;
    this.bulletType = bulletType;

    this.top = function() {
        return this.y;
    };
    this.bottom = function() {
        return this.y + this.height;
    };
    this.left = function() {
        return this.x;
    };
    this.right = function() {
        return this.x + this.width;
    };
}

function Mouse() {
    this.x;
    this.y;
}

/**
 * Any moving object that can collide with a bullet
 */
function Guy(x, y, img, velocity, height, width, points, hp, isSpider, type) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.velocity = velocity;
    this.width = width;
	this.scaledWidth = function() {
		return this.width * Global.scaling();
	}
	this.height = height;
	this.scaledHeight = function() {
		return this.height * Global.scaling();
	}
    this.direction = true; //true is right, false is left
    this.points = points;
    this.hp = hp;
    this.isSpider = isSpider;
    this.type = type;

    this.top = function() {
        return this.y;
    };
    this.bottom = function() {
        return this.y + this.scaledHeight();
    };
    this.left = function() {
        return this.x;
    };
    this.right = function() {
        return this.x + this.scaledWidth();
    };
	this.centerX = function() {
		return this.x - (this.scaledWidth() / 2);
	};
	this.centerY = function() {
		return this.y - (this.scaledHeight() / 2);
	};
    this.cusType = function() {
        return this.type;
    };
} /************* End Objects *************/