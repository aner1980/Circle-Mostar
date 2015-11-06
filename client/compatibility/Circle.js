var Apple = 10;

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
}
	


function Circle(){
	this.x=250;
	this.y=250;
	this.direction=undefined;
	this.time=150;
	this.speed=190;
	this.radius=0.5;
	this.timeIncreasePerFood=5;
	this.speedDecreasePerFood=10; //TODO: Case when reaching the limit.
	this.radiusIncreasePerFood=0.5;
	this.score=0;
	this.powerUpTime=0;
	this.move=function(direction){
		switch(direction) {
		  case Direction.up:
			this.y--;
			break;
		  case Direction.down:
			this.y++;
			break;
		  case Direction.left:
			this.x--;
			break;
		  case Direction.right:
			this.x++;
		}
		this.time-=20/this.speed;
		if(timeExpire(this.time) || hitEdge(this)) {
		  alert('Your score is '+this.score);
		  return false;
		}
		if(this.powerUpTime>0) {
		  this.powerUpTime-=20/this.speed;
		  if(this.powerUpTime <= 0)
			this.speed-=10; //currently i'm just assuming all powerups just accelerates speed for 20(time unit)
		}
		if(eatFood(this)) {
		  this.radius+=this.radiusIncreasePerFood;
		  this.speed-=this.speedDecreasePerFood;
		  this.time+=this.timeIncreasePerFood;
		  this.score++;
		} else if(eatPowerup(this)) { //currently i'm just assuming all powerups just accelerates speed for 20(time unit)
		  this.speed+=10;
		  this.powerUpTime+=20;
		}
		//TODO: eat dummy NPC.
		return true;
	};
	
	function hitEdge(circle){
		var scale=Math.floor(circle.radius)*10;
		if(circle.x-scale<0 || circle.y-scale<0 || circle.x+scale>=Board.Size.width || circle.y+scale>=Board.Size.height) {
			return true;
		} else {
			return false;
		}
	};

	function eatFood(circle){
		var eatScale=Math.round(circle.radius)*10; //times 10 to be more sensitive
		for(var i=circle.x-eatScale; i<circle.x+eatScale; i++) {
			for(var j=circle.y-eatScale; j<circle.y+eatScale; j++) {
				for(var k=0; k<Board.Foods.length; k++){
					if(i==Board.Foods[k].x && j==Board.Foods[k].y) {
						Board.generateFood(i,j,circle);
						return true;
					}
				}
			}
		}
		return false;
	};

	function eatPowerup(circle){
		var eatScale=Math.round(circle.radius)*10;
		for(var i=circle.x-eatScale; i<circle.x+eatScale; i++) {
			for(var j=circle.y-eatScale; j<circle.y+eatScale; j++) {
				for(var k=0; k<Board.PowerUps.length; k++){
					if(i==Board.PowerUps[k].x && j==Board.PowerUps[k].y) {
						Board.generatePowerUp(i,j,circle);
						return true;
					}
				}
			}
		}
		return false;
	};

	function timeExpire(time){
		if(time <= 0) {
			return true;
		} else {
			return false;
		}
	}
}