/**
 * Copyright (c) 2012, Matthew Erickson (Matt@MattErickson.ME)
 * All rights reserved.
 * 
 * Please see copyright.txt for full license details
 **/
 /*document ready function */
function PrepGame() {
	//html $(GALAGA_CANVAS) object
    GALAGA_CANVAS = document.createElement("canvas");
	GALAGA_CANVAS.id = "GALAGA_CANVAS";
	GALAGA_CANVAS.display = "block";
	GALAGA_CANVAS.height = Constants.canvasHeight;
	GALAGA_CANVAS.width = Constants.canvasWidth;
	GALAGA_CANVAS.backgroundColor = "black";
	$("body").append(GALAGA_CANVAS);
    //html5 context of the $(GALAGA_CANVAS)
    Constants.GALAGA_CONTEXT = GALAGA_CANVAS.getContext("2d");

    //Can't access jquery $ outside of scope
    sound0 = $('#sound0')[0];
    sound1 = $('#sound1')[0];
    sound2 = $('#sound2')[0];
    sound3 = $('#sound3')[0];
    sound4 = $('#sound4')[0];
    sound5 = $('#sound5')[0];
    sound6 = $('#sound6')[0];
    sound7 = $('#sound7')[0];
    sound8 = $('#sound8')[0];
    sound9 = $('#sound9')[0];
    sound10 = $('#sound10')[0];
    sound11 = $('#sound11')[0];
    sound12 = $('#sound12')[0];
    sound13 = $('#sound13')[0];
    sound14 = $('#sound14')[0];


   /* jQuery("#classicOrFree").dialog({
        resizable: false,
        height: 140,
        modal: true,
        buttons: {
            "Classic": function() {
                gameTypeClassic = true;
                ready();
                jQuery(this).dialog("close");
            },
            "Free-Flight": function() {
                gameTypeClassic = false;
                ready();
                jQuery(this).dialog("close");
            }
        }
    });*/
	gameTypeClassic = true;
	ready();
}