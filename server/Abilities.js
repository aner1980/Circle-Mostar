Meteor.startup(function() {

	Abilities.upsert({aid: 1}, {aid: 1, level: 1, icon: "/powerup-speed.png", name: "Speed Boost (Sample 1)", desc: "Boosts movement speed by 60 for 10 seconds", duration: 10, bonus: 60});
	Abilities.upsert({aid: 2}, {aid: 2, level: 1, icon: "/powerup-bomb.png",  name: "Big Ben (Sample 2)", desc: "Lays a bomb at your current position. After 10 seconds the bomb explodes and damages any players caught int its radius.", duration: 10, bonus: 60});
	Abilities.upsert({aid: 3}, {aid: 3, level: 1, icon: "/powerup-reverse.png",  name: "Time Winder (Sample 3)", desc: "Reverses the controls of all enemy units within a 300-unit radius around your current position. Lasts for 10 seconds.", duration: 10, bonus: 60});

});

Meteor.publish('Abilities', function() {
	return Abilities.find();
});