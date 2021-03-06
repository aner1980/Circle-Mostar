achvCheck = function(circle){
	//loop through the player's achievement array
	//player achievement array contains a list of achievements the player has earned, marked by id
	console.log('CHECKIGN ACHIEVEMENTS [' + Achievements.find().count() + ']');
	var user_achievements = Meteor.user().profile.achievements;
	for(var i=0; i<Achievements.find().count(); i++) {
		switch(i) {
			case 1:
				//consumed another player
				if((_.indexOf(user_achievements, i) == -1) && (circle.players_eaten > 0)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Nobody Likes Salad", "Achievement Unlocked!");
				}
				break;
			case 2:
				//consume 5 other players without dying
				if((_.indexOf(user_achievements, i) == -1) && (circle.players_eaten >= 5)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("The Atkins Diet", "Achievement Unlocked!");
				}
				break;
			case 3:	
				//consume 25 other players without dying
				if((_.indexOf(user_achievements, i) == -1) && (circle.players_eaten >= 25)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Diabeetus", "Achievement Unlocked!");
				}
				break;
			case 4: 
				//consume 50 other players without dying
				if((_.indexOf(user_achievements, i) == -1) && (circle.players_eaten >= 50)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Successor the Hutt", "Achievement Unlocked!");
				}
				break;
			case 5:
				//die without eating any food
				if((_.indexOf(user_achievements, i) == -1) && (circle.food_eaten == 0) && (circle.deaths > 0)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("AFK", "Achievement Unlocked!");
				}
				break;
			case 6: 
				//trigger a speed power up
				console.log('USED SPEED: ' + circle.speed_powerup);
				if((_.indexOf(user_achievements, i) == -1) && (circle.speed_powerup > 0)){
					console.log('ACHIEVE UNLOCKED FOR SPEEDUP');
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Reckless Driving", "Achievement Unlocked!");
				}
				break;
			case 7: 
				//Get consumed during a speed boost
				if((_.indexOf(user_achievements, i) == -1) && (circle.died_while_speeding > 0)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Drunk Driving", "Achievement Unlocked!");
				}
				break;
			case 8: 
				//get consumed by another player
				if((_.indexOf(user_achievements, i) == -1) && (circle.died_from_consumption > 0)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Natural Selection", "Achievement Unlocked!");
				}
				break;
			case 9:
				//Achieve maximum size by only consuming food circles
				if ((_.indexOf(user_achievements, i) == -1) && (circle.radius > 500) && (circle.players_eaten == 0)) {
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Vegetarian", "Achievement Unlocked!");
				}
				break;
			case 10:
				//consume 2 players at the same time
				if ((_.indexOf(user_achievements, i) == -1) && (circle.consumed_multiple_players >= 2)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Double Stuff", "Achievement Unlocked!");
				}
				break;
			case 11:
				//consume 5 players at the same time
				if ((_.indexOf(user_achievements, i) == -1) && (circle.consumed_multiple_players >= 5)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Fist Full of small fries.", "Achievement Unlocked!");
				}
				break;
			case 12:
				//consume 10 players at the same time
				if ((_.indexOf(user_achievements, i) == -1) && (circle.consumed_multiple_players >= 10)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Black Hole", "Achievement Unlocked!");
				}
				break;
			case 13: 
				//Fail to consume another player because they're the same size
				if ((_.indexOf(user_achievements, i) == -1) && (circle.failed_consumption > 0)){
					user_achievements.push(i);		//if the achievement is NOT in the collection, add it.
					toastr.success("Sumo Wrestling", "Achievement Unlocked!");
				}
				break;
			default:
		}
		
		// Update regardless, even if no changes were made (lazy code!)
		//Meteor.users.update(circle.user_id, {$set: {"profile.achievements": user_achievements}});
			
	}
};