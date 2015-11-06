Meteor.startup(function() {
	Deps.autorun(function() {
		Meteor.subscribe('Abilities');
	})
});

Template.profile_page.helpers({
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

Template.profile_page.events({
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

Template.choose_ability.helpers({
	abilities: function() {
		return Abilities.find();
	}
});

Template.choose_ability.events({
	'click #mask': function() {
		Session.set('ProfileOp', '');
	}
});

Template.ability_entry.events({
	'click .ability-entry': function(e) {
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

Template.achievements.helpers({
	achievements: function() {
		return Achievements.find({id: {$in: Meteor.user().profile.achievements}});
	}
});