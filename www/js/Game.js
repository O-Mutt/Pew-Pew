var Game = function() {
	var pressedKeys = {};
	var player;
	var playerLives = 5;
	var clonePlayer;
	//Game counters
	var playerScore = 0;
	var level = 1;
	var lives;
	var stopThere = false;
};
Game = {
	Ready: function() {
		Events.SizeChanged();
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
		Global.sound0 = $('#sound0')[0];
		Global.sound1 = $('#sound1')[0];
		Global.sound2 = $('#sound2')[0];
		Global.sound3 = $('#sound3')[0];
		Global.sound4 = $('#sound4')[0];
		Global.sound5 = $('#sound5')[0];
		Global.sound6 = $('#sound6')[0];
		Global.sound7 = $('#sound7')[0];
		Global.sound8 = $('#sound8')[0];
		Global.sound9 = $('#sound9')[0];
		Global.sound10 = $('#sound10')[0];
		Global.sound11 = $('#sound11')[0];
		Global.sound12 = $('#sound12')[0];
		Global.sound13 = $('#sound13')[0];
		Global.sound14 = $('#sound14')[0];

		Events.initListeners();

	   /* jQuery("#classicOrFree").dialog({
			resizable: false,
			height: 140,
			modal: true,
			buttons: {
				"Classic": function() {
					Options.gameTypeClassic = true;
					ready();
					jQuery(this).dialog("close");
				},
				"Free-Flight": function() {
					Options.gameTypeClassic = false;
					ready();
					jQuery(this).dialog("close");
				}
			}
		});*/
		Options.gameTypeClassic = true;
		
		
		//Game wide options
		this.lives = Constants.playerLives;

		//page images
		Global.bad1 = document.getElementById("bad1");
		Global.bad2 = document.getElementById("bad2");
		Global.bad3 = document.getElementById("bad3");
		Global.good = document.getElementById("good");
		Global.boss = document.getElementById("boss");
		Global.laser = document.getElementById("laser");
		Global.explosion = document.getElementById("explosion");
		Global.vim = document.getElementById("vim");
		//Sets up the pregame to show the good ship and message to start
		setPreGame();
	}
};