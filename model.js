Abilities = new Mongo.Collection('Abilities');
User = new Mongo.Collection('Players');
Food = new Mongo.Collection('Foods');
PowerUp = new Mongo.Collection('Powerups');
Achievements = new Mongo.Collection('achievements');
Bounds = [ [0,0], [2000,2000] ];
PowerupTable = [ 
	{icon: '/powerup-empty.png'}, 
	{name: "speed", duration: 5, bonus: 60, icon: '/powerup-speed.png'},
	{name: "invisible", duration: 10, bonus: 0, icon: '/powerup-invis.png'}
];