var DELTAT = 0.0625;
var RADIUS_DECAY_MOD = 1/25;
var RADIUS_DECAY_PS = 3; // per second
var FOOD_RADIUS_INCREASE = .5;
var GameIntervalDemo = null;
var KeyMap = [];
var TotalTimePlayed = 0;

/*
var User = new Mongo.Collection('Players');
var Food = new Mongo.Collection('Foods');
var PowerUp = new Mongo.Collection('Powerups');

/*
function performMove(Circle, dt) {
	// Change velocity for user circle
	if (Circle.user_id == Meteor.userId()) {
		var userVel = [0, 0];
		if (KeyMap[37] == 1) {
			// Left
			userVel[0] += -1;
		}
		if (KeyMap[39] == 1) {
			// Right
			userVel[0] += 1;
		}
		if (KeyMap[38] == 1) {
			// Up
			userVel[1] += -1;
		}
		if (KeyMap[40] == 1) {
			// Down
			userVel[1] += 1;
		}
		Circle.vel = userVel;
		//console.log(userVel);
	}
	Circle.pos[0] += Circle.vel[0] * Circle.speed * dt;
	Circle.pos[1] += Circle.vel[1] * Circle.speed * dt;
}
*/

function checkCollide(Circle1, Circle2) {
	var mag = Math.sqrt( 
		Math.pow(Circle1.pos[0] - Circle2.pos[0], 2) +  // dX^2
		Math.pow(Circle1.pos[1] - Circle2.pos[1], 2)    // dY^2
	);
	var collideDist = Circle1.radius + Circle2.radius - Math.min(Circle1.radius, Circle2.radius)/2;
	
	if (mag <= collideDist && (Circle1.entity == 1 || Circle2.entity == 1) && (Circle1.radius > 0 && Circle2.radius > 0)) {
		//console.log("COLLISION!");
		//console.log(Circle1);
		//console.log(Circle2);
		// Consume!
		if (Circle1.entity == 1 && Circle2.entity != 1) {
			consumeOrGather(Circle1, Circle2);
		} else if (Circle2.entity == 1 && Circle1.entity != 1) {
			consumeOrGather(Circle2, Circle1);
		} else if (Circle1.radius > Circle2.radius) {
			//Consume Circle2
//			console.log('1 > 2');
			consumeOrGather(Circle1, Circle2); // Circle2.radius = 0;
		} else if (Circle2.radius > Circle1.radius) {
			// Consume Circle1
//			console.log('2 > 1');
			consumeOrGather(Circle2, Circle1); // Circle1.radius = 0;
		} 
	}
}

function consumeOrGather(OwnerCircle, UsedCircle) {
	UsedCircle.radius = 0;
	if (UsedCircle.entity == 1) {
		// Consumed PLAYER
		OwnerCircle.radius += UsedCircle.radius / 2;
		OwnerCircle.players_eaten += 1;
		
		if (UsedCircle.powerup == 1 && UsedCircle.pu_active > 0) {
			UsedCircle.died_while_speeding += 1;
		}
		UsedCircle.died_from_consumption = 1;
		
		// Update Owner and Used
		User.update({user_id: OwnerCircle.user_id}, { 
			$set: {
				radius: OwnerCircle.radius,
				players_eaten: OwnerCircle.players_eaten
			}
		});
		
		User.update({user_id: UsedCircle.user_id}, { 
			$set: {
				radius: 0,
				died_while_speeding: UsedCircle.died_while_speeding,
				died_from_consumption: 1
			}
		});
		
	} else if (UsedCircle.entity == 2) {
		// Consumed POWERUP
		if (OwnerCircle.powerup == 0) {
			OwnerCircle.powerup = UsedCircle.powerup;
			OwnerCircle.pu_active = -1; //Powerups[OwnerCircle.powerup].duration;
			//Session.set('PowerupIcon', Powerups[OwnerCircle.powerup].icon);
			
			// Give Powerup to Owner 
			User.update({user_id: OwnerCircle.user_id}, {
				$set: {
					powerup: OwnerCircle.powerup,
					pu_active: OwnerCircle.pu_active
				}
			});
			
			PowerUp.update(UsedCircle._id, { 
				$set: {
					radius: 0
				}
			});
		}
	} else if (UsedCircle.entity == 3) {
		// Consumed FOOD
		OwnerCircle.radius += FOOD_RADIUS_INCREASE;
		OwnerCircle.food_eaten += 1;
		
		// Give Food to Owner 
		User.update({user_id: OwnerCircle.user_id}, {
			$set: {
				radius: OwnerCircle.radius,
				food_eaten: OwnerCircle.food_eaten
			}
		});
			
		Food.update(UsedCircle._id, { 
			$set: {
				radius: 0
			}
		});
	}
}

var Powerups = [ {icon: '/powerup-empty.png'}, {name: "speed", duration: 5, bonus: 60, icon: '/powerup-speed.png'} ]

Board = {
	Active_Circles: [], // Array to store circles
	Active_Players: [],
	Active_Foods: [],
	Active_Powerups: [],
	Size: [1500, 850],
	activatePowerup: function(circle) {
		//TODO: Meteor.Method()
	},
	doAllMove: function() {
		var activePlayers = User.find({is_playing: true}).fetch();
		for (var i = 0; i < activePlayers.length; i++) {
			var user = activePlayers[i];
			// performMove()
			user.pos[0] += user.vel[0] * user.speed * DELTAT;
			user.pos[1] += user.vel[1] * user.speed * DELTAT;
			
			if (!user.isDummy && user.entity == 1) {
				user.radius -= Math.max(user.radius * RADIUS_DECAY_MOD * DELTAT, DELTAT); //RADIUS_DECAY_PS * DELTAT;
			}
			User.update({user_id: user.user_id}, {$set: {
				pos : user.pos,
				radius: user.radius
			}
			});
		}
	},
	detectAllCollisions: function() {
		var activePlayers = User.find({is_playing: true}).fetch();
		var activeFoods = Food.find().fetch();
		var activePowerups = PowerUp.find().fetch();
		
		//console.log(activePlayers);

		for (var i = 0; i < activePlayers.length; i++) {
			var Circle1 = activePlayers[i];
			
			// Check player collision
			//console.log('Checking collision of PLAYERS');
			for (var k = i+1; k < activePlayers.length; k++) {
				var Circle2 = activePlayers[k];
				checkCollide(Circle1, Circle2);
			}
			
			// Check food collision
			//console.log('Checking collision of FOODS (' + activeFoods.length + ')');
			for (var k = 0; k < activeFoods.length; k++) {
				var Circle2 = activeFoods[k];
				//console.log(Circle1);
				//console.log(Circle2);
				checkCollide(Circle1, Circle2);
			}
			
			// Check powerup collision
			//console.log('Checking collision of POWERUPS');
			for (var k = 0; k < activePowerups.length; k++) {
				var Circle2 = activePowerups[k];
				checkCollide(Circle1, Circle2);
			}
		}
	},
	runPowerups: function() {
		var activePlayers = User.find({is_playing: true}).fetch();
		
		for (var i = 0; i < activePlayers.length; i++) {
			var player = activePlayers[i];
			var powerup = player.powerup;
			if (powerup > 0 && player.entity == 1) {
				//console.log('POWERUP: ' + powerup);
				console.log('Running Powerups (' + powerup + ') for player ' + player.user_id + ' | Checking ...');
				console.log('\t' + player.pu_active + ' == ' + PowerupTable[powerup].duration);
				if (player.pu_active == PowerupTable[powerup].duration) {
					switch (powerup) {
						case 1:
							player.speed += PowerupTable[1].bonus;
							break;
					}
				} else if (player.pu_active == -1) {
					continue;
				} else if (player.pu_active <= 0) {
					switch (powerup) {
						case 1: 
							player.speed -= PowerupTable[1].bonus;
							player.powerup = 0;
							break;
					}
				}
				player.pu_active -= DELTAT;
				
				console.log('New pu_active: ' + player.pu_active);
				
				// Apply updates to server
				User.update({user_id: player.user_id}, {
					$set: {
						pu_active: player.pu_active,
						speed: player.speed,
						powerup: player.powerup
					}
				});
			}
		}
					
	},
	getTimeMultiplier: function(circle) {
		var calcMult = 0;
		var secs = (new Date().valueOf() - circle.startTime) / 1000;
		
		if (secs < 30) {
			calcMult = 0;
		} else if (secs < 60) {
			calcMult = 0.5;
		} else {
			calcMult = 1;
		}
		return Math.min( calcMult, 1 );
	},
	determineGameOver: function() {
		//var activePlayers = User.find({is_playing: true}).fetch();
		var deadPlayers = User.find({radius: { $lte: 0 }, is_playing: true}).fetch();
		
		for (var i = 0; i < deadPlayers.length; i++) {
			var player = deadPlayers[i];
			player.deaths = 1;
			
			// Check Achievements
			achvCheck(player);
					
			// Get XP and Currency for playing
			var xp = 50 + 1 * player.food_eaten + 5 * player.players_eaten;
			xp += xp * Board.getTimeMultiplier(player);
			var currency = 200 + 5 * player.food_eaten + 20 * player.players_eaten;
			
			// Update profile with new values
			Meteor.users.update(player.user_id, {$inc: {'profile.experience': xp, 'profile.currency': currency}});
			
			User.update({user_id: player.user_id}, { 
				$set: {
					radius: 0,
					is_playing: false,
					round_reward: [xp, currency]
				}
			});
		}
		
		// They lose the game so no longer playing
		//User.update({radius: { $lte: 0 }}, { $set: { is_playing: false, round_reward: [xp, currency] }});
		
		// Remove foods and powerups that have been eaten
		//Food.update({radius: { $lte: 0 }}, { $set: { is_playing: false }});
		//PowerUp.update({radius: { $lte: 0 }}, { $set: { is_playing: false }});
		
		/*
		var newCircles = [];
		for (var i = 0; i < activePlayers.length; i++) {
			var player = activePlayers[i];
			if (player.radius > 0) {
				newCircles.push(player);
			} else {
				console.log('GAME OVER');
				//if (player.user_id == Meteor.userId()) {
					achvCheck(player);
					//Session.set('GameState', 'Over');
					
					
					var xp = 50 + 5 * player.food_eaten + 15 * player.players_eaten;
					var currency = 200 + 5 * player.food_eaten + 20 * player.players_eaten;
					
					Meteor.users.update(player.user_id, {$inc: {experience: xp, 'profile.currency': currency}});
				//}
			}
		}
		this.Active_Circles = newCircles;
		*/
	},
	createEntity: function(entityType, x, y) {
		var C = new Circle2();
		C.pos = [x, y];
		C.speed = 150;
		C.entity = entityType;
		if (entityType == 2) {
			C.powerup = 1;
		}
		this.Active_Circles.push(C);
	},
	drawBoard: function() {
		var ctx = document.querySelector('canvas').getContext('2d');
		ctx.clearRect(0,0,Board2.Size[0],Board2.Size[1]);
		
		for (var i = 0; i < this.Active_Circles.length; i++) {
			var Circle = this.Active_Circles[i]
			var x = Circle.pos[0];
			var y = Circle.pos[1];
			
			if (Circle.entity == 1) {
				if (Circle.user_id == Meteor.userId()) {
					ctx.fillStyle = 'black';
				} else {
					ctx.fillStyle = 'yellow';
				}
			} else if (Circle.entity == 2) {
				ctx.fillStyle = 'blue';
			} else if (Circle.entity == 3) {
				ctx.fillStyle = 'red';
			}
			
			ctx.beginPath();
			ctx.arc(x, y, Circle.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
			
			/*
			
                      ctx.beginPath();
                      ctx.arc(Board.Foods[i].x,Board.Foods[i].y,5,0,2*Math.PI);
                      ctx.fill();
                      ctx.stroke();
			*/
		}	
	},

	initialize: function() {
		/*
		this.Active_Circles = GameBoard.findOne().ActiveCircles;
		console.log( GameBoard.findOne());
		// Clear board
		var ctx = document.querySelector('canvas').getContext('2d');
		ctx.clearRect(0,0,Board2.Size[0],Board2.Size[1]);
		
		// Create Player Circle
		var Plr = new Circle2();
		Plr.pos = [Math.ceil(Math.random()*1480) + 5, Math.ceil(Math.random()*830) + 5];
		Plr.radius = 30;
		Plr.entity = 1;
		Plr.user_id = Meteor.userId();
		this.Active_Circles.push(Plr)
		GameBoard.update({_id: GameBoard.findOne()._id}, {ActiveCircles: Board2.Active_Circles});
		// Begin the game
		Session.set('GameState', 'Playing');
		TotalTimePlayed = 0;
		*/
		GameIntervalDemo = Meteor.setInterval(this.performTick, DELTAT*1000);
	},
	performTick: function() {
		/*
		//console.log('NEW LOOP');
		if (Session.get('GameState') == 'Over') {
			clearInterval(GameIntervalDemo);
		}
		//TotalTimePlayed += DELTAT;
		//$("#game-time-text").text(getTimePlayed());
		*/
		//Board2.drawBoard();
		Board.doAllMove();
		Board.detectAllCollisions();
		Board.runPowerups();
		Board.determineGameOver();
		//GameBoard.update({_id: GameBoard.findOne()._id}, {ActiveCircles: Board2.Active_Circles});
	}
		
};

/*
function getTimePlayed() {
	var mins = Math.floor(TotalTimePlayed/60);
	var secs = (Math.floor(TotalTimePlayed) % 60);
	return mins + ":" + (secs<10 ? "0"+secs : secs);
}

/*
$(function() {
	// Set up event listener

	document.addEventListener('keydown',function(e){
		KeyMap[e.keyCode] = 1;
		
		// SPACEBAR -- ACTIVATE OBTAINED POWERUP
		if (e.keyCode == 32) {
			var myCirc = Board2.getCircleFromUserID(Meteor.userId()); //TODO: change to Meteor.Method().
			if (myCirc) {
				Board2.activatePowerup(myCirc);
			}
		}
	});
	document.addEventListener('keyup', function(e){
		KeyMap[e.keyCode] = 0;
	});
});

*/