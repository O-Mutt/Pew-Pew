/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/

 function selectSpider(){
    do{
        var idx = Math.floor(Math.random() * 100) % Global.badGuys.length;
        if(Global.badGuys[idx].type){
            var type = Global.badGuys[idx].cusType();
            var a = Global.badGuys[idx].top();
        }
        //Global.badGuys[idx].height ;
        //Global.badGuys[idx].width += 2;
//        alert(Global.badGuys.length + '   '+idx+ '   '+type+ '   '+a )
    } while(type != 'bad1');
    Global.badGuys[idx].isSpider = true;
}

function goBackSpider() {
    if( Global.spider.y > oriPosY ){
        Global.spider.y -= 2;
    } else {
        Global.isSpiderMove = false;
        Global.isViming = false;
        Game.player.x = $(Global.PEWPEW_CANVAS).width/2;
        Game.player.y = 370;
    }
}

function moveSpider() {
    if (Global.spider.y < ($(Global.PEWPEW_CANVAS).height*4)/5) {
        Global.spider.y += 2;
    } else {
        Game.isViming = true;
    }
}