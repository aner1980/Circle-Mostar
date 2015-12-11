Meteor.startup(function() {
	Meteor.subscribe('Players');
	Meteor.subscribe('Foods');
	Meteor.subscribe('Powerups');
	Meteor.subscribe('Abilities');
	Meteor.subscribe('achievements');
	
	Session.set('ProfileOp', '');
	Session.set('GameState', 'NotStarted');
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
	},
	'click #login-user': function() {
		Modal.show('loginModal');
	},
	'click #logout-user': function() { 
		Meteor.logout();
	}
});

Template.site.onRendered(function() {
});

Template.accountOptions.helpers({
	choosingAbility: function() {
		return Session.get('ProfileOp') == "Ability";
	},
	getAbility: function(slot) {
		if (slot == 1) {
			return Meteor.user().profile.abil1;
		} else if (slot == 2) {
			return Meteor.user().profile.abil2;
		}
	}
});

Template.accountOptions.events({
	'click .user-logout': function() {
		Meteor.logout();
	},
	'click #btn-play-game': function() {
		var GameState = Session.get('GameState')
		if (GameState != 'Started' && GameState != 'Playing') {
			Session.set('GameState', 'Started');
			//Board2.initialize_demo1();
			Meteor.call('startGame', function(error, result) {	
				if (error) {
					console.log('ERR');
				} else {
					if (result) { 
						Session.set('GameState', 'Playing');
						$('#acc-ops-container').toggle(false);
					}
					else
						console.log('ERR');
				}
			});
		}
	},
	'click .abil': function(e) {
		var sender = e.currentTarget;
		if (sender.id == 'abil-sel-1') {
			Session.set('AbilitySlot', 1);
		} else {
			Session.set('AbilitySlot', 2);
		}
		Session.set('ProfileOp', 'Ability');
	}
});

Template.accountLevel.helpers({
	getLevelProgress: function() {
		var XP = Meteor.user().profile.experience;
		var level = Math.min(Math.floor(XP / 10000), 20);
		var progress = Math.min((XP - level * 10000) / 10000, 1);
		console.log('User XP: ' + XP);
		return progress * 250;
	},
	getLevel: function() {
		var XP = Meteor.user().profile.experience;
		var level = Math.min(Math.floor(XP / 10000), 20);
		console.log('User level: ' + level);
		return level;
	}
});


Template.abilitySelect.helpers({
	abilities: function() {
		return Abilities.find();
	}
});

Template.abilitySelect.events({
	'click #mask': function() {
		Session.set('ProfileOp', '');
	}
});

Template.ability_entry.events({
	'click .ability-entry': function(e) {
		console.log('Attempting to select ability');
		var a_id = Number(e.currentTarget.id);
		var prof = Meteor.user().profile
		var newIco = Abilities.findOne({aid: a_id}).icon;
		//alert('Selected Ability: ' + a_id);
		//alert(Abilities.findOne({aid: a_id}).icon);
		Meteor.users.update(Meteor.userId(), {$set: {["profile.abil"+Session.get('AbilitySlot')]: newIco}});
		//Meteor.user().profile["abil" + Session.get('AbilitySlot')] = Abilities.findOne({aid: a_id}).icon;
		Session.set('ProfileOp', '');
	}
});

Template.achievementsUnlocked.helpers({
	achievements: function() {
		return Achievements.find({id: {$in: Meteor.user().profile.achievements}});
	}
});

Template.achievementsLocked.helpers({
	achievements: function() {
		return Achievements.find({id: {$nin: Meteor.user().profile.achievements}});
	}
});

Template.playerControls.events({
	'change .ctrl-sel': function(e) {
		var rad = $(e.currentTarget);
		if (rad.prop('checked')) {
			//alert(rad.prop('checked'));
			Session.set('ControlOp', rad.val());
			//alert('Changed ControlOp to ' + rad.prop('checked'));
		}
	},
	'load .ctrl-sel': function(e) {
		var rad = $(e.currentTarget);
		rad.prop('checked', Session.get('ControlOp') == rad.val());
	}
});
	




Template.gameNotStarted.events({
	'click .game-start': function() {
		Session.set('GameState', 'Started');
		//Board2.initialize_demo1();
		Meteor.call('startGame', function(error, result) {	
			if (error) {
				console.log('ERR');
			} else {
				if (result)
					Session.set('GameState', 'Playing');
				else
					console.log('ERR');
			}
		});
	}
});

Template.gameOver.events({
	'click .game-start': function() {
		Session.set('GameState', 'Started');
		//Board2.initialize_demo1();
		Meteor.call('startGame', function(error, result) {	
			if (error) {
				console.log('ERR');
			} else {
				if (result)
					Session.set('GameState', 'Playing');
				else
					console.log('ERR');
			}
		});
	}
});

Template.gameOver.helpers({
	getReward: function(rewardType) {
		var me = User.findOne({user_id: Meteor.userId()});
		if (rewardType == 'XP')
			return me.round_reward[0];
		else if (rewardType == 'Currency')
			return me.round_reward[1];
		else
			return 'N/A';
	}
});

$(function() {
	
	Session.set('CurrentPage', 'Game');
	Session.set('GameState', 'NotStarted');
	Session.set('PowerupIcon', '/powerup-empty.png');
	
	if (Session.get('ControlOp')!='Mouse') {
		Session.set('ControlOp', 'Keys');
		$('#ctrl-keys').prop('checked', true);
	} else
		$('#ctrl-mouse').prop('checked', true);
	
	window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
});