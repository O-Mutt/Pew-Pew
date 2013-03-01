function Boss(x, y, img, velocity, height, width, points, hp) {
	var SURI_NUMBER = 5;

    this.x = x;
    this.y = y;
    this.img = img;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.direction = true; //true is right, false is left
    this.points = points;
    this.hp = hp;

    this.suriArr = new Array();

    this.laserLength = 0;
    this.isFiredLaser = false;

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

    this.increaseLaserHeight = function(){
    	if(this.isFiredLaser){
    		this.laserLength += 10;
    		return this.laserLength;
    	}else{
    		return 0;
    	}
    }

    this.getLaserHeight = function(){
    	return this.laserLength;
    }

    this.startLaser = function(){
    	this.isFiredLaser = true;
    }

    this.stopLaser = function(){
    	this.isFiredLaser = false;
    	this.laserLength = 0;
    }

    var skipIdx = Math.floor(Math.random() * 100) % 11;
    this.shoot = function(){
//    	console.log("suri fire!");
		for(i=(-1*SURI_NUMBER);i<=SURI_NUMBER;i++){
            if(i === skipIdx){
                // do something if the i is skipIdx
            }else{
                this.suriArr.push(new Suri(this.x+(this.width/2), this.y+this.height, i, SURI_NUMBER));
//    		console.log("suri added->"+i);
            }
    	}
    }
}

function Suri(x, y, idx, suriNumber){
	this.img = $('#suri').get(0);
	this.age = 0;
	this.startX = x;
	this.startY = y;

	this.posX = x;
	this.posY = y;
	this.idx = idx;

	this.suriNumber = suriNumber;

	this.move = function(){
		this.age++;
		this.posY = this.startY + (this.age*2);
		this.posX = this.startX + ((this.idx/this.suriNumber)*(this.posY-this.startY));
		//console.log(this.startX+":"+this.startY+"->"+this.posX+":"+this.posY);
	}

	this.left = function(){		
		return this.posX;
	}
	this.right = function(){
		return this.posX + 13;
	}
	this.top = function(){
		return this.posY;
	}

	this.bottom = function(){
		return this.posY + 13;
	}
} 


