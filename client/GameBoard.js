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
});