function checkBadGuyIntersection() {
	$.each(Global.badGuys, function(index, badGuy) {
		if (intersect(Game.player, badGuy)) {
			Global.PEWPEW_CONTEXT.drawImage(explosion, Game.player.centerX(), Game.player.centerY(), Game.player.width, Game.player.height);
			Global.playSound(Global.sound7);
			if( Global.isPewPewMerged ){
				Global.numOfPewPew--;
				Global.isPewPewMerged = false;
			} else {
				Game.Mechanics.PlayerDead("Collision in Redraw Player");
			}
		}
	});
}