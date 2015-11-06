Meteor.startup(function() {

	Abilities.upsert({aid: 1}, {aid: 1, level: 1, icon: "/powerup-speed.png", name: "Speed Boost (Sample 1)", desc: "Boosts movement speed by 60 for 10 seconds", duration: 10, bonus: 60});
	Abilities.upsert({aid: 2}, {aid: 2, level: 1, icon: "/powerup-bomb.png",  name: "Big Ben (Sample 2)", desc: "Lays a bomb at your current position. After 10 seconds the bomb explodes and damages any players caught int its radius.", duration: 10, bonus: 60});
	Abilities.upsert({aid: 3}, {aid: 3, level: 1, icon: "/powerup-reverse.png",  name: "Time Winder (Sample 3)", desc: "Reverses the controls of all enemy units within a 300-unit radius around your current position. Lasts for 10 seconds.", duration: 10, bonus: 60});
	Abilities.upsert({aid: 4}, {aid: 4, level: 1, icon: "/powerup-invis.png",  name: "Invisibility (Sample 4)", desc: "Light bends around you which grants you 95% opacity for 10 seconds.", duration: 10, bonus: 60});
	Abilities.upsert({aid: 5}, {aid: 5, level: 1, icon: "/powerup-health.png",  name: "Health Boost (Sample 5)", desc: "Gives you a burst of health; heals you for 50 radius instantly.", duration: 10, bonus: 60});
	Abilities.upsert({aid: 6}, {aid: 6, level: 1, icon: "/powerup-poison.png",  name: "Toxin (Sample 6)", desc: "Release a stash of toxic chemicals on your current position, which poisons any enemy units that pass through the field. Poison damages over time and decreases the effectiveness of healing.", duration: 10, bonus: 60});

});

Meteor.publish('Abilities', function() {
	return Abilities.find();
});