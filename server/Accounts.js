Accounts.onCreateUser(function(options, user) {
	user.profile = {
		image: ""
	};
	user.profile.currency = 0;
	user.profile.achievements = [];
	user.profile.TopScore = 0;
	user.profile.abil1 = '/powerup-question.png';
	user.profile.abil2 = '/powerup-question.png';
	user.profile.experience = 0;
	return user;
});

Meteor.users.allow({
	update: function() {
		return true;
	}
});

ServiceConfiguration.configurations.remove({});

ServiceConfiguration.configurations.upsert({service: 'facebook'}, {
    service: 'facebook',
    appId: '812411045548823',
    secret: 'cd7c9e4fd723e04c0838a7b91aaf2c14'
});

ServiceConfiguration.configurations.upsert({service: 'google'}, {
  service: "google",
  clientId: "939025466903-d8gbrfdk50d30613ma0uhs1bbbo5s44r.apps.googleusercontent.com",
  secret: "tM_e1DdNWiKXQ9aiV7WboM5u"
});