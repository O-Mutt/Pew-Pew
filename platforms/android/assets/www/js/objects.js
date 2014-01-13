/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

 /************* Objects *************/
/**
 * Bullets fired
 * @param x x location
 * @param y y location
 * @param height height of the bullet
 * @param width the width of the bullet
 * @param xdiff DERPPP lul what?
 * @bulletType maybe if the bullet is a god mode bullet or not?!?
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
 * @param x x location of the object
 * @param y x location of the object
 * @param img the image in the dom that will show the bad guy
 * @param velocity the initial velocity of the 'badguy'
 * @param height the height of the image
 * @param width the width of the img
 * @param points the amount of points a player will earn when they kill this 'badguy'
 * @param hp the amount of hp this 'badguy' has
 * @param isSpider whether or not this 'badguy' is a spider
 * @param type what type of 'badguy' this object is
 */
function BadGuy(x, y, img, velocity, height, width, points, hp, isSpider, type) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.velocity = velocity;
	this.acceleration;
    this.width = width;
	this.height = height;
    this.direction = true; //true is right, false is left
    this.points = Game.level * points;
    this.hp = hp;
    this.isSpider = isSpider;
    this.type = type;

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
	
	this.centerX = function() {
		return this.x - (this.width / 2);
	};
	this.centerY = function() {
		return this.y - (this.height / 2);
	};
	
    this.cusType = function() {
        return this.type;
    };
}

/**
 * Any moving object that can collide with a bullet
 */
function GoodGuy(x, y, img, height, width, hp) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.velocity;
	this.acceleration;
    this.width = width;
	this.height = height;
    this.direction = true; //true is right, false is left
    this.points;
    this.hp = hp;

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
	
	this.centerX = function() {
		return this.x - (this.width / 2);
	};
	this.centerY = function() {
		return this.y - (this.height / 2);
	};
}
/************* End Objects *************/