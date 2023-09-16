const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const UserDetails = require("../models/UserDetails");

const router = express.Router();

// ******************************** //
// google authentication   //

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("profile2", profile)
      let existingUser = await UserDetails.findOne({ email: profile.emails[0].value });
      console.log("existingUser", existingUser)
      if (existingUser) {
          done(null, existingUser);
      } else {
          const newUser = new UserDetails({
              authId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value 
          });

          const savedUser = await newUser.save();
          done(null, savedUser);
      }
  } catch (err) {
      console.error(err);
      done(err, null);
  }
}));

router.get('/login/federated/google',passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: process.env.SUCCESS_REDIRECT,
  failureRedirect: process.env.FAILURE_REDIRECT
}));


// ******************************** //
// github authentication   //


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID, 
  clientSecret: process.env.GITHUB_CLIENT_SECRET, 
  callbackURL: process.env.GITHUB_REDIRECT_URL,
  scope: ['profile','email']

}, async (accessToken, refreshToken, profile, done) => {
  console.log("profile1", profile)
  try {
    let existingUser = await UserDetails.findOne({ username: profile.username });

    if (existingUser) {
      done(null, existingUser);
    } else {
      
      const newUser = new UserDetails({
        authId: profile.id,
        username: profile.username, 
        profileUrl : profile.profileUrl,
        email: profile.emails && profile.emails[0] && profile.emails[0].value || ''
      });

      const savedUser = await newUser.save();
      done(null, savedUser);
    }
  } catch (err) {
    console.error(err);
    done(err, null);
  }
}));

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: process.env.FAILURE_REDIRECT}),
  function(req, res) {
    res.redirect(process.env.SUCCESS_REDIRECT);
  }
);

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(process.env.BASE_URL);
  });
});


module.exports =  router;