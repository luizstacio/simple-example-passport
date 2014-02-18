/**
 * Exemplo de login usando facebook e twitter.
 * exemplo base tirado de http://nodebr.com/primeiros-passos-com-passport-e-express-em-node-js/
*/

'use strict';

var express = require('express'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    app = express();
 
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'usado para calcular o hash' }));
app.use(passport.initialize());
app.use(passport.session());
 
passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var TWITTER_CONSUMER_KEY = 'INSIRA_SUA_KEY_AQUI';
var TWITTER_CONSUMER_SECRET = 'INSIRA_SUA_SECRET_AQUI';
 
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    var user = profile;
    return done(null, user);
  }
));

var FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
var FACEBOOK_APP_SECRET ='FACEBOOK_APP_SECRET';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://url_your_app:3000/auth/facebook/callback'
  },
  function(token, tokenSecret, profile, done) {
    var user = profile;
    return done(null, user);
  }
));
 
app.get('/', function(req, res){
    res.send('<html><body>Ola mundo<br/><a href="/login">Login</a></body></html>');
  });
 
app.get('/account',
  ensureLoggedIn('/login'),
  function(req, res) {
    res.send('<html><body>Ola '+ req.user.username+'.<br/><a href="/logout">Logout</a></body></html> ');
  });
 
app.get('/login',
  function(req, res) {
    res.send('<html><body><a href="/auth/twitter">Login com Twitter</a><br/><br/><a href="/auth/facebook">Login com Facebook</a></body></html>');
  });
  
app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/account', failureRedirect: '/login' }));
 
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successReturnToOrRedirect: '/account', failureRedirect: '/login' }));
 
app.listen(3000);
console.log('Server init');