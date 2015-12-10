Abilities = new Mongo.Collection('Abilities');
User = new Mongo.Collection('Players');
Food = new Mongo.Collection('Foods');
PowerUp = new Mongo.Collection('Powerups');
PowerupTable = [ 
	{icon: '/powerup-empty.png'}, 
	{name: "speed", duration: 5, bonus: 60, icon: '/powerup-speed.png'} 
];