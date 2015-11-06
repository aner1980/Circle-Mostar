var GameBoard = new Mongo.Collection('game_board');

function Circle2() {
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
};

Meteor.startup(function () {
	  	var Active_Circles=[];
		// Create food
		for (var i = 0; i < 200; i++) {
			var F = new Circle2();
			var x = Math.ceil(Math.random()*1480) + 5;
			var y = Math.ceil(Math.random()*830) + 5;
			F.entity = 3;
			F.radius = 5;
			F.pos = [x, y];
			Active_Circles.push(F);
		}

		//create powerUps
		for (var i = 0; i < 50; i++) {
			var F = new Circle2();
			var x = Math.ceil(Math.random()*500) + 5 + 500;
			var y = Math.ceil(Math.random()*500) + 5 + 200;
			F.entity = 2;
			F.powerup = 1;
			F.radius = 5;
			F.pos = [x, y];
			Active_Circles.push(F);
		}

		// Create Dummy Player (Bigger)
		var D1 = new Circle2();
		D1.pos = [125, 375];
		D1.radius = 50;
		D1.entity = 1;
		D1.isDummy = true;
		Active_Circles.push(D1);
		
		var D2 = new Circle2();
		D2.pos = [375, 125];
		D2.radius = 20;
		D2.entity = 1;
		D2.isDummy = true;
		Active_Circles.push(D2);

		GameBoard.insert({ActiveCircles:Active_Circles});
});