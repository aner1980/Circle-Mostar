/*
var User = new Mongo.Collection('Players');
var Food = new Mongo.Collection('Foods');
var PowerUp = new Mongo.Collection('Powerups');
/**/

var PowerupTable = [ {icon: '/powerup-empty.png'}, {name: "speed", duration: 5, bonus: 60, icon: '/powerup-speed.png'} ];

function Circle() {
	this.pos = [0, 0];
	this.vel = [0, 0];
	this.speed = 100;
	this.radius = 5;
	this.powerup = 0;
	this.pu_active = 0;
	this.user_id = "";
	this.entity = 0;
	this.game_over_flag = false;
	this.isDummy = false
	this.players_eaten = 0;
	this.food_eaten = 0;
	this.speed_powerup = 0;
	this.died_while_speeding = 0;
	this.died_from_consumption = 0;
	this.consumed_multiple_players = 0;
	this.failed_consumption = 0;
	this.is_playing = false;
};

Meteor.methods({
	startGame: function() {
		if(this.userId==null) {
			throw new Meteor.Error("logged-out", "The user must be logged in to start new game.");
		}
		var currentUser = user.findOne();
		var newPlayer = new Circle();
		newPlayer.pos = [Math.ceil(Math.random()*1480) + 5, Math.ceil(Math.random()*830) + 5];
		newPlayer.radius = 30;
		newPlayer.entity = 1;
		newPlayer.user_id = this.userId;
		newPlayer.is_playing = true;
		User.upsert({user_id:this.userId}, newPlayer);
	},

	changeDirection: function(velocity) {
		if(this.userId==null) {
			throw new Meteor.Error("logged-out", "The user must be playing to change direction.");
		}
		if(!User.findOne({user_id: this.userId})) {
			throw new Meteor.Error("logged-out", "The user must be playing to change direction.");
		}
		User.update({user_id:this.userId}, {$set: {vel : velocity}});
	},

	activatePowerUp: function() {
		if(this.userId==null) {
			throw new Meteor.Error("logged-out", "The user must be playing to change direction.");
		}
		if(!User.findOne({user_id: this.userId})) {
			throw new Meteor.Error("logged-out", "The user must be playing to change direction.");
		}
		var player = User.findOne({user_id:this.userId});
		var pid = player.powerup;
		if (pid > 0 && Powerups[pid] && player.pu_active == -1) {
			if (pid == 1) {
				User.update({user_id:this.userId}, {
					$set: {
						pu_active : PowerupTable[pid].duration, 
						speed_powerup : 1
					}
				});
			}
		}
	}
});

Meteor.startup(function () {
		// Create food
		for (var i = 0; i < 200; i++) {
			var newFood = new Circle();
			var x = Math.ceil(Math.random()*1480) + 5;
			var y = Math.ceil(Math.random()*830) + 5;
			newFood.entity = 3;
			newFood.radius = 5;
			newFood.pos = [x, y];
			Food.insert(newFood);
		}

		//create powerUps
		for (var i = 0; i < 50; i++) {
			var newPowerUp = new Circle();
			var x = Math.ceil(Math.random()*500) + 5 + 500;
			var y = Math.ceil(Math.random()*500) + 5 + 200;
			newPowerUp.entity = 2;
			newPowerUp.powerup = 1;
			newPowerUp.radius = 5;
			newPowerUp.pos = [x, y];
			PowerUp.insert(newPowerUp);
		}
		Board.initialize();
});