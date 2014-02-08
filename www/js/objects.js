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
    this.move = function() {
    	this.y -= (2 * Global.scaling()) + (Game.level * 0.1);
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
var GoodGuy = GoodGuy || {};
GoodGuy.x;
GoodGuy.y;
GoodGuy.img;
GoodGuy.velocity;
GoodGuy.acceleration;
GoodGuy.width;
GoodGuy.height;
GoodGuy.direction; //true is right, false is left
GoodGuy.points;
GoodGuy.hp;

GoodGuy.top = function() {
    return this.y;
};
GoodGuy.bottom = function() {
    return this.y + this.height;
};
GoodGuy.left = function() {
    return this.x;
};
GoodGuy.right = function() {
    return this.x + this.width;
};

GoodGuy.centerX = function() {
	return this.x - (this.width / 2);
};
GoodGuy.centerY = function() {
	return this.y - (this.height / 2);
};
GoodGuy.move = function() {
	this.moveX();
	this.moveY();
};
GoodGuy.moveY = function() {
	if (Options.GameType === GameTypes.CLASSIC) {
        this.y = Global.PEWPEW_CANVAS.height - (this.height * 2);//leave space for the player finger/score
    } else if (Options.GameType === GameTypes.FREE) {
        this.y = Global.mouse.y;
    }
};
GoodGuy.moveX = function() {
	if (Options.ControllerType == Controller.ACCELEROMETER) {
		if (this.acceleration && this.acceleration != 0) {
			this.x += this.acceleration;
		}
	} else {
		this.x = Global.mouse.x;
	}
};
GoodGuy.init = function () {
	this.x = (Global.PEWPEW_CANVAS.width / 2);
	this.y = Global.PEWPEW_CANVAS.height - (Constants.GUYHEIGHT * Global.scaling());
	this.img = Global.good;
	this.height = (Constants.GUYHEIGHT * Global.scaling());
	this.width = (Constants.GUYWIDTH * Global.scaling());
	this.hp = 1;
};
/************* End Objects *************/