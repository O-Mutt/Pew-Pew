var Game = Game || {};
Game.pressedKeys = Game.pressedKeys || {};
Game.playerLives = 5;
Game.clonePlayer;
Game.player;

//Game counters
Game.playerScore = 0;
Game.level = 1;
Game.lives;
Game.stopThere = false;
Game.Init = function() {
	//html $(Global.PEWPEW_CANVAS) object
	Global.PEWPEW_CANVAS = document.createElement('canvas');
	Global.PEWPEW_CANVAS.id = 'PEWPEW_CANVAS';
	Global.PEWPEW_CANVAS.display = 'block';
	Global.PEWPEW_CANVAS.style.background = 'black';
	$('body').append(Global.PEWPEW_CANVAS);
	//html5 context of the $(Global.PEWPEW_CANVAS)
	Global.PEWPEW_CONTEXT = Global.PEWPEW_CANVAS.getContext('2d');
	Events.SizeChanged();
	
	//Can't access jquery $ outside of scope
	Global.sound0 = document.getElementById('sound0');
	Global.sound1 = document.getElementById('sound1');
	Global.sound2 = document.getElementById('sound2');
	Global.sound3 = document.getElementById('sound3');
	Global.sound4 = document.getElementById('sound4');
	Global.sound5 = document.getElementById('sound5');
	Global.sound6 = document.getElementById('sound6');
	Global.sound7 = document.getElementById('sound7');
	Global.sound8 = document.getElementById('sound8');
	Global.sound9 = document.getElementById('sound9');
	Global.sound10 = document.getElementById('sound10');
	Global.sound11 = document.getElementById('sound11');
	Global.sound12 = document.getElementById('sound12');
	Global.sound13 = document.getElementById('sound13');
	Global.sound14 = document.getElementById('sound14');

	Events.initListeners();

   /* jQuery('#classicOrFree').dialog({
		resizable: false,
		height: 140,
		modal: true,
		buttons: {
			'Classic': function() {
				Options.gameTypeClassic = true;
				ready();
				jQuery(this).dialog('close');
			},
			'Free-Flight': function() {
				Options.gameTypeClassic = false;
				ready();
				jQuery(this).dialog('close');
			}
		}
	});*/
	Options.gameTypeClassic = true;
	
	
	//Game wide options
	Game.lives = Constants.PLAYERLIVES;

	//page images
	Global.bad1 = document.getElementById('bad1');
	Global.bad2 = document.getElementById('bad2');
	Global.bad3 = document.getElementById('bad3');
	Global.good = document.getElementById('good');
	Global.boss = document.getElementById('boss');
	Global.laser = document.getElementById('laser');
	Global.explosion = document.getElementById('explosion');
	Global.vim = document.getElementById('vim');
	//Sets up the pregame to show the good ship and message to start
	Game.InitForTitleScreen();
	login.trySilentAuth();
},
Game.InitForTitleScreen = function() {
	console.log('Set pre');
	initPlayer(false);
}
Game.Start = function() {
	clearInterval(Global.fakeGame); //Clear the pregame
	Global.fakeGame = 0; //Remove pregame interval id
	initPewPew(); //init the game!
}