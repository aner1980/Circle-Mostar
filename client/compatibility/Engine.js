var DELTAT = 0.0625;
var RADIUS_DELAY_PS = 3; // per second
var FOOD_RADIUS_INCREASE = 3;
var GameIntervalDemo = null;
var KeyMap = [];
var TotalTimePlayed = 0;
var mousePos = [0, 0];

//TODO: Get PowerupIcon --> player.powerup -- Powerups[#].icon | DONE
//TODO: Set GameOver when dead (status 'Playing' + not playing) | DONE
//TODO: Set Playing when starting (Meteor.call()) | DONE

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
	if (UsedCircle.entity == 1) {
		// Consumed PLAYER
		OwnerCircle.radius += UsedCircle.radius / 2;
		OwnerCircle.players_eaten += 1;
		
		if (UsedCircle.powerup == 1 && UsedCircle.pu_active > 0) {
			UsedCircle.died_while_speeding += 1;
		}
		UsedCircle.died_from_consumption = 1;
	} else if (UsedCircle.entity == 2) {
		// Consumed POWERUP
		if (OwnerCircle.powerup == 0) {
			OwnerCircle.powerup = UsedCircle.powerup;
			OwnerCircle.pu_active = -1; //Powerups[OwnerCircle.powerup].duration;
			Session.set('PowerupIcon', Powerups[OwnerCircle.powerup].icon);
		}
	} else if (UsedCircle.entity == 3) {
		// Consumed FOOD
		OwnerCircle.radius += FOOD_RADIUS_INCREASE;
		OwnerCircle.food_eaten += 1;
	}
	UsedCircle.radius = 0;
}

var Powerups = [ {icon: '/powerup-empty.png'}, {name: "speed", duration: 5, bonus: 60, icon: '/powerup-speed.png'} ]

var Board2 = {
	Active_Circles: [], // Array to store circles
	Size: [1500, 850],
	getCircleFromUserID: function(uid)  {
		for (var i = 0; i < this.Active_Circles.length; i++) {
			var Circ = this.Active_Circles[i];
			if (Circ.user_id == uid) {
				return Circ;
			}
		}
		return null;
	},
	activatePowerup: function(circle) {
		var pid = circle.powerup;
		if (pid > 0 && Powerups[pid] && circle.pu_active == -1) {
			circle.pu_active = Powerups[pid].duration;
			Session.set('PowerupIcon', '/powerup-empty.png');
			
			if (pid == 1) {
				circle.speed_powerup = 1;
			}
		}
	},
	doAllMove: function() {
//		console.log(this);
		for (var i = 0; i < this.Active_Circles.length; i++) {
			var Circle = this.Active_Circles[i];
			performMove(Circle, DELTAT);
			if (!Circle.isDummy && Circle.entity == 1) {
				Circle.radius -= RADIUS_DELAY_PS * DELTAT;
			}
		}
	},
	detectAllCollisions: function() {
		for (var i = 0; i < this.Active_Circles.length; i++) {
			for (var k = i+1; k < this.Active_Circles.length; k++) {
				var Circle1 = this.Active_Circles[i];
				var Circle2 = this.Active_Circles[k];
				checkCollide(Circle1, Circle2);
			}
		}
	},
	runPowerups: function() {
		for (var i = 0; i < this.Active_Circles.length; i++) {
			var Circle = this.Active_Circles[i];
			var powerup = Circle.powerup;
			if (powerup > 0 && Circle.entity == 1) {
				console.log('POWERUP: ' + powerup);
				if (Circle.pu_active == Powerups[powerup].duration) {
					switch (powerup) {
						case 1:
							Circle.speed += Powerups[1].bonus;
							break;
					}
				} else if (Circle.pu_active == -1) {
					continue;
				} else if (Circle.pu_active <= 0) {
					switch (powerup) {
						case 1: 
							Circle.speed -= Powerups[1].bonus;
							Circle.powerup = 0;
							break;
					}
				}
				Circle.pu_active -= DELTAT;
			}
		}
					
	},
	determineGameOver: function() {
		var newCircles = [];
		for (var i = 0; i < this.Active_Circles.length; i++) {
			var Circle = this.Active_Circles[i];
			if (Circle.radius > 0) {
				newCircles.push(Circle);
			} else {
				console.log('GAME OVER');
				if (Circle.user_id == Meteor.userId()) {
					achvCheck(Circle);
					Session.set('GameState', 'Over');
					
					var xp = 50 + 5 * Circle.food_eaten + 15 * Circle.players_eaten;
					var currency = 200 + 5 * Circle.food_eaten + 20 * Circle.players_eaten;
					
					Meteor.users.update(Circle.user_id, {$inc: {experience: xp, 'profile.currency': currency}});
				}
			}
		}
		this.Active_Circles = newCircles;
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
			
			
			
                      ctx.beginPath();
                      ctx.arc(Board.Foods[i].x,Board.Foods[i].y,5,0,2*Math.PI);
                      ctx.fill();
                      ctx.stroke();
			
		}	
	},

	initialize_demo1: function() {
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
		GameIntervalDemo = setInterval(this.performTick, DELTAT*1000);
	},
	performTick: function() {
		//console.log('NEW LOOP');
		if (Session.get('GameState') == 'Over') {
			clearInterval(GameIntervalDemo);
		}
		TotalTimePlayed += DELTAT;
		$("#game-time-text").text(getTimePlayed());
		Board2.Active_Circles = GameBoard.findOne().ActiveCircles;
		Board2.drawBoard();
		Board2.doAllMove();
		Board2.detectAllCollisions();
		Board2.runPowerups();
		Board2.determineGameOver();
		GameBoard.update({_id: GameBoard.findOne()._id}, {ActiveCircles: Board2.Active_Circles});
	}
		
};
*/

function drawBoard() {
		var currentPlayers = User.find({is_playing: true}).fetch();
		var currentFoods = Food.find().fetch();
		var currentPowerups = PowerUp.find().fetch();
		var cvs = document.querySelector('canvas')
		if (cvs == null)
			return;
		
		// Correct canvas width/height based on display width/height
		cvs.width = window.innerWidth;
		cvs.height = window.innerHeight;
		
		//console.log('#Players: ' + currentPlayers.length + '\n' + 
		//			'#Foods: ' + currentFoods.length + '\n' + 
		//			'#Powerups: ' + currentPowerups.length);
		
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0,0,cvs.width,cvs.height);
		
		//console.log('Canvas size: [' + cvs.width + ',' + cvs.height + ']');
		
		// DRAW THE FOODS
		for (var i = 0; i < currentFoods.length; i++) {
			var Circle = currentFoods[i]
			var x = Circle.pos[0];
			var y = Circle.pos[1];
			
			ctx.fillStyle = 'red';
			
			ctx.beginPath();
			ctx.arc(x, y, Circle.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}	
		
		// DRAW THE POWERUPS
		for (var i = 0; i < currentPowerups.length; i++) {
			var Circle = currentPowerups[i]
			var x = Circle.pos[0];
			var y = Circle.pos[1];
			ctx.fillStyle = 'blue';
			
			ctx.beginPath();
			ctx.arc(x, y, Circle.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
		
		// DRAW THE PLAYERS
		for (var i = 0; i < currentPlayers.length; i++) {
			var Circle = currentPlayers[i]
			var x = Circle.pos[0];
			var y = Circle.pos[1];
			
			if (Circle.radius <= 0) 
				continue;
			
			if (Circle.user_id == Meteor.userId()) {
				ctx.fillStyle = 'black';
			} else {
				ctx.fillStyle = 'yellow';
			}
			
			ctx.beginPath();
			ctx.arc(x, y, Circle.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}	
	}

function SendVelocityUpdate() {
	if (Session.get('ControlOp')=='Keys') {
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
		Meteor.call('changeDirection', userVel);
	}
}

function runGame() {
	drawBoard();
	
	
	var me = User.findOne({user_id: Meteor.userId()});
	if (me) {
		if (me.powerup >= 0 && me.pu_active == -1) {
			Session.set('PowerupIcon', PowerupTable[me.powerup].icon);
		} else if (me.pu_active >= 0) {
			Session.set('PowerupIcon', PowerupTable[0].icon);
		}
		console.log('Game Status: ' + me.is_playing + ' | ' + Session.get('GameState') + ' | ' + me.radius);
		if (me.radius==0 && !me.is_playing && Session.get('GameState')=='Playing') {
			Session.set('GameState', 'GameOver');
			$('#acc-ops-container').toggle(true);
		}
	
		if (me.is_playing) {
			// Mouse Movement
			if (Session.get('ControlOp')=='Mouse') {
				//var myCirc = User.findOne({user_id: Meteor.userId()});
				//console.log(myCirc);
				//console.log(myCirc.is_playing);
				if (!me || !me.is_playing || Session.get('ControlOp')!='Mouse') {
					//console.log('playr does not have circle');
					return;
				}
				//console.log('doing move');
				var dx = mousePos[0] - me.pos[0];
				var dy = mousePos[1] - me.pos[1];
				//console.log(dx + ", " + dy);
				var mag = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
				//console.log('Attempt to move with mouse');
				Meteor.call('changeDirection', [dx / mag, dy/mag]);
			}
			$("#game-time-text").text(getTimePlayed(me.startTime));
		}
	} else {
		$("#game-time-text").text('00:00');
	}
}
	

function getTimePlayed(start) {
	var difMillis = new Date().valueOf() - start;
	var difSecs = difMillis / 1000;
	var mins = Math.floor(difSecs/60);
	var secs = (Math.floor(difSecs) % 60);
	return mins + ":" + (secs<10 ? "0"+secs : secs);
}

$(function() {
	// Set up event listener
	
	$("#cvs-game-board").on('mousemove', function(e) {
		mousePos[0] = e.clientX;
		mousePos[1] = e.clientY;
		//console.log('MouseMove');
	});

	document.addEventListener('keydown',function(e){
		KeyMap[e.keyCode] = 1;
		
		// SPACEBAR -- ACTIVATE OBTAINED POWERUP
		if (e.keyCode == 32) {
			var activated = Meteor.call('activatePowerup');
			if (activated) 
				Session.set('PowerupIcon', '/powerup-empty.png');
			/*
			var myCirc = Board2.getCircleFromUserID(Meteor.userId());
			if (myCirc) {
				Board2.activatePowerup(myCirc);
			}
			*/
		}
		
		switch (e.keyCode) {
			case 37: case 38: case 39: case 40:
				SendVelocityUpdate();
				break;
		}
	});
	document.addEventListener('keyup', function(e){
		KeyMap[e.keyCode] = 0;
		
		switch (e.keyCode) {
			case 37: case 38: case 39: case 40:
				SendVelocityUpdate();
				break;
		}
	});
	
	setInterval(runGame, DELTAT);
});
/*

            var Board={
                Foods:[], //Array to store pixels
                PowerUps:[],
                Size:{
                    width:500,
                    height:500
                },
                 // substitute the old food with a new food at a random pixel
                generateFood:function(x,y,circle){
                    for(var i=0; i<this.Foods.length;i++){
                        if(this.Foods[i].x == x && this.Foods[i].y == y) {
                          this.Foods[i] = this.generateEmptyPixel(circle);
                          break;
                        }
                    }
                }, 
                 generatePowerUp:function(x,y,circle){
                    for(var i=0; i<this.PowerUps.length;i++){
                        if(this.PowerUps[i].x == x && this.PowerUps[i].y == y) {
                          this.PowerUps[i] = this.generateEmptyPixel(circle);
                          break;
                        }
                    }
                },
                initGenerate:function(circle){
                    var pixelCount=Board.Size.width*Board.Size.height;
                    var foodCount=pixelCount/10000; // 1 out of 1000 pixels are foods.
                    for(var i=0; i<foodCount; i++) {
                        this.Foods[i]=this.generateEmptyPixel(circle);
                    }
                    var powerUpCount=pixelCount/100000; // 1 out of 10000 pixels are powerUps.
                    for(var i=0; i<powerUpCount; i++) {
                        this.PowerUps[i]=this.generateEmptyPixel(circle);
                    }
                },
                generateEmptyPixel:function(circle){
                    var lowX = circle.x-Math.ceil(circle.radius);
                    var HighX = circle.x+Math.ceil(circle.radius);
                    var lowY = circle.y-Math.ceil(circle.radius);
                    var HighY = circle.y+Math.ceil(circle.radius);
                    var map=[]; // Map for al the empty pixels available
                    for(var x=0; x<this.Size.width; x++) {
                      for(var y=0; y<this.Size.height; y++) {
                        if(x<=HighX && x>=lowX && y<=HighY && y>=lowY) {
                          continue;
                        }
                        var isEmpty=true;
                        for(var i=0; i<this.Foods.length; i++) {
                          if(x==this.Foods[i].x && y==this.Foods[i].y){
                            isEmpty=false;
                            break;
                          }
                        }
                        if(!isEmpty) {
                          continue;
                        }
                        for(var i=0; i<this.PowerUps.length; i++) {
                          if(x==this.PowerUps[i].x && y==this.PowerUps[i].y){
                            isEmpty=false;
                            break;
                          }
                        }
                        if(isEmpty) {
                          map.push([x,y]);
                        }
                      }
                    }
                    var i=Math.floor(Math.random()*map.length);
                    return {x:map[i][0], y:map[i][1]};
                }
            };

            var Direction={
                up:1,
                right:2,
                down:-1,
                left:-2
            };

            function init(){
                var circle=new Circle();
                Board.initGenerate(circle);
                var ctx=document.querySelector('canvas').getContext('2d');

                function draw(circle){
                    ctx.clearRect(0,0,500,500);

                    ctx.beginPath();
                    ctx.fillStyle='black';
                    ctx.arc(circle.x,circle.y,circle.radius*10,0,2*Math.PI);        
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle='red';
                    for(var i=0; i<Board.Foods.length; i++) {
                      ctx.beginPath();
                      ctx.arc(Board.Foods[i].x,Board.Foods[i].y,5,0,2*Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }

                    ctx.fillStyle='blue';
                    for(var i=0; i<Board.PowerUps.length; i++) {
                      ctx.beginPath();
                      ctx.arc(Board.PowerUps[i].x,Board.PowerUps[i].y,5,0,2*Math.PI);
                      ctx.fill();
                      ctx.stroke();
                    }
                }

                var direction,dict_direction=[];
                dict_direction[37]=Direction.left;
                dict_direction[38]=Direction.up;
                dict_direction[39]=Direction.right;
                dict_direction[40]=Direction.down;

                document.addEventListener('keydown',function(e){
                    direction=dict_direction[e.keyCode]||direction;
                });

                (function(){
                    if(circle.move(direction)){
                        draw(circle);
                        console.log(circle.time);
                        setTimeout(arguments.callee,200-circle.speed)
                    }

                })();
            }*/
			/*
			$(function(){
            init();
        });*/