Template.site.helpers({
	pageIs: function(page) {
		if (Session.get('CurrentPage') == page) {
			return true;
		}
		return false;
	},
	gameStateIs: function(state) {
		if (Session.get('GameState') == state) {
			return true;
		}
		return false;
	},
	getPowerupIcon: function() {
		return Session.get('PowerupIcon')
	}
});

Template.site.events({
	'click #to-game': function() {
		clearInterval(GameIntervalDemo);
		Session.set('GameState', 'NotStarted');
		Session.set('CurrentPage', 'Game');
	},
	'click #to-profile': function() {
		Session.set('CurrentPage', 'Profile');
	}
});

Template.site.onRendered(function() {
});

Template.gameNotStarted.events({
	'click .game-start': function() {
		Session.set('GameState', 'Started');
		Board2.initialize_demo1();
	}
});

Template.gameOver.events({
	'click .game-start': function() {
		Session.set('GameState', 'Started');
		Board2.initialize_demo1();
	}
});

$(function() {
	Session.set('CurrentPage', 'Game');
	Session.set('GameState', 'NotStarted');
	Session.set('PowerupIcon', '/powerup-empty.png');
	
	/*
	$("canvas").on('mousemove', function(e) {
		//console.log('MouseMove');
		var myCirc = Board2.getCircleFromUserID(Meteor.userId());
		if (!myCirc) {
			//console.log('playr does not have circle');
			return;
		}
		//console.log('doing move');
		var dx = e.clientX //- myCirc.pos[0]
		var dy = e.clientY// - myCirc.pos[1]
		console.log(dx + ", " + dy);
		var mag = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
		myCirc.vel[0] = dx / mag;
		myCirc.vel[1] = dy / mag;
	});
	*/
	window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
});