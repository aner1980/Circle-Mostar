/*
Template.headerLogin.events({
	'click #login': function() {
		AccountsTemplates.setState('signIn');
		Modal.show('loginModal');
	},
	'click #changePwd': function() {
		AccountsTemplates.setState('changePwd');
		Modal.show('loginModal');
	},
	'click #logOut': function() {
		Meteor.logout();
	}
});

Avatar.setOptions({
	fallbackType: "default image",
	//defaultImageUrl: "https://d13yacurqjgara.cloudfront.net/users/712998/avatars/small/87eba5378e98c6d22a5438505d12a9b0.png?1449145728",
	gravatarDefault: "identicon"

});

Template.facebooklogin.events({
	'click #facebook-login': function(event) {
		Meteor.loginWithFacebook({}, function(err) {
			if (err) {
				throw new Meteor.Error("Facebook login failed");
			}
		});
	},

	'click #logout': function(event) {
		Meteor.logout(function(err) {
			if (err) {
				throw new Meteor.Error("Logout failed");
			}
		})
	}
});

// Click on avatar thingy
	Template.profileAvatar.events({
	"click .avatar-image": function(){
				$('#editYourAvatarModal').modal();
			}
	});

Template.googleLogin.events({
	'click #google-login': function(event) {
		Meteor.loginWithGoogle({}, function(err) {
			if (err) {
				throw new Meteor.Error("Google login failed");
			}
		});
	},

	'click #logout': function(event) {
		Meteor.logout(function(err) {
			if (err) {
				throw new Meteor.Error("Logout failed");
			}
		})
	}
});
/**/

AccountsTemplates.configure({
	showForgotPasswordLink: true,
	texts: {
		signInLink_pre: "Already have an account?",
		signInLink_link: "Login",
		signUpLink_pre: "Don't have an account?",
		signUpLink_link: "register",
		pwdLink_link: "Forgot password?",
		title: {
			signUp: "register",
			signIn: "login",
			forgotPwd: "Reset password",
			changePwd: "Change password"
		},
		button: {
			signUp: "register",
			signIn: "login",
			forgotPwd: "Reset password"
		},
		errors: {
			//captchaVerification: "Captcha Code is not correct!",
			loginForbidden: "Login not possible. Are you sure that your E-Mail address is correct??",
			//mustBeLoggedIn: "Must be logged in",
			pwdMismatch: "The passwords do not match.",
			validationErrors: "Sorry, something went wrong.",
			//verifyEmailFirst: "Please verify your email first. Check the email and follow the link!",
		}
	},
	showReCaptcha: false
	/*
	https://www.google.com/recaptcha/intro/index.html
	reCaptcha: {
	  siteKey: YOUR SITE KEY,
	  theme: "light",
	  data_type: "image"
	},
	showReCaptcha: true
	*/
});

AccountsTemplates.addField({
	_id: 'username',
	type: 'text',
	displayName: 'UserName',
	placeholder: 'UserName',
	required: true
});

AccountsTemplates.removeField('email'); // there is a bug with the package, configuration will only work if we first remove the email field first
AccountsTemplates.addField({
	_id: 'email',
	type: 'email',
	displayName: 'E-Mail',
	placeholder: 'E-Mail',
	required: true
});

AccountsTemplates.removeField('password'); // same goes for password
AccountsTemplates.addField({
	_id: 'password',
	type: 'password',
	displayName: 'Password',
	placeholder: 'Password',
	required: true
});

AccountsTemplates.addField({
	_id: 'password_again',
	type: 'password',
	displayName: 'Repeat password',
	placeholder: 'Repeat password',
	required: true
});

/*
Accounts.onLogin(function() {
	Modal.hide('loginModal');
});
/**/