Meteor.startup(function() {
	Tracker.autorun(function() {
		Meteor.subscribe('Players');
		Meteor.subscribe('Foods');
		Meteor.subscribe('Powerups');
		if (User) {
		User.find(Meteor.userId()).observeChanges({
			changed: function(id, fields) {
				console.log('Received changes to player from server');
				if (fields.powerup) {
					Session.set('PowerupIcon', PowerupTable[myCircle.powerup].icon);
				} else if (!fields.is_playing && Session.get('GameState')=='Playing') {
					Session.set('GameState', 'GameOver');
				}
			}
		});
		/*
			var myCircle = User.findOne(Meteor.userId());
			if (myCircle) {
				console.log('Tracker runs');
				// Check for game over
				if (!myCircle.is_playing && Session.get('GameState')=='Playing')
					Session.set('GameState', 'GameOver')
				
				// Check for powerup collected
				if (myCircle.powerup > 0 && myCircle.pu_active < 0 && PowerupTable[myCircle.powerup])
					Session.set('PowerupIcon', PowerupTable[myCircle.powerup].icon);
			}
		*/
		}
	});

});

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
		//Board2.initialize_demo1();
		var started = Meteor.call('startGame');
		if (started)
			Session.set('GameState', 'Playing');
	}
});

Template.gameOver.events({
	'click .game-start': function() {
		Session.set('GameState', 'Started');
		//Board2.initialize_demo1();
		var started = Meteor.call('startGame');
		if (started)
			Session.set('GameState', 'Playing');
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