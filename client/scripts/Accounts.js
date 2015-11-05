Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '812411045548823',
    secret: 'cd7c9e4fd723e04c0838a7b91aaf2c14'
});

Accounts.loginServiceConfiguration.remove({
  service: "google"
});
Accounts.loginServiceConfiguration.insert({
  service: "google",
  clientId: " 939025466903-bmaabkihclp15i4td0eglstckfm59lf0.apps.googleusercontent.com ",
  secret: "eXuhW4LJvx7nthHUSW9NJ9Zo"
});

