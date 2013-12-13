/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 function selectSpider(){
    do{
        var idx = Math.floor(Math.random() * 100) % badGuys.length;
        if(badGuys[idx].type){
            var type = badGuys[idx].cusType();
            var a = badGuys[idx].top();
        }
        //badGuys[idx].height ;
        //badGuys[idx].width += 2;
//        alert(badGuys.length + '   '+idx+ '   '+type+ '   '+a )
    }while(type != 'bad1');
    badGuys[idx].isSpider = true;
}

function goBackSpider() {
    if( spider.y > oriPosY ){
        spider.y -= 2;
    }else{
        isSpiderMove = false;
        isViming = false;
        player.x = GALAGA_CANVAS.width/2;
        player.y = 370;
    }
}

function moveSpider() {
    if (spider.y < (GALAGA_CANVAS.height*4)/5) {
        spider.y += 2;
    } else {
        isViming = true;
    }
}