Accounts.onCreateUser(function(options, user) {
	user.profile = {};
	user.profile.currency = 0;
	user.profile.achievements = [];
	user.profile.TopScore = 0;
	user.profile.abil1 = '/powerup-question.png';
	user.profile.abil2 = '/powerup-question.png';
	user.experience = 0;
	return user;
});