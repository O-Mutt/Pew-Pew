function checkBadGuyIntersection() {
	$.each(Global.badGuys, function(index, badGuy) {
		if (intersect(Game.player, badGuy)) {
			Global.GALAGA_CONTEXT.drawImage(explosion, Game.player.centerX(), Game.player.centerY(), Game.player.width, Game.player.height);
			Global.playSound(Global.sound7);
			if( Global.isGalagaMerged ){
				Global.numOfGalaga--;
				Global.isGalagaMerged = false;
			} else {
				setEndGame("Collision in Redraw Player");
			}
		}
	});
}