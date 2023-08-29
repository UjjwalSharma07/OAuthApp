const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const UserDetails = require("../models/UserDetails");

const router = express.Router();
const BASE_URL = process.env.BASE_URL

// ******************************** //
// google authentication   //


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
      let existingUser = await UserDetails.findOne({ googleId: profile.id });

      if (existingUser) {
          done(null, existingUser);
      } else {
          const newUser = new UserDetails({
              googleId: profile.id,
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
  successRedirect: `${BASE_URL}/dummy`,
  failureRedirect: `${BASE_URL}/signup`
}));




// ******************************** //
// github authentication   //


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID, 
  clientSecret: process.env.GITHUB_CLIENT_SECRET, 
  callbackURL: "/auth/github/callback",
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile)
    let existingUser = await UserDetails.findOne({ githubId: profile.id });
    
    if (existingUser) {
      done(null, existingUser);
    } else {
      const newUser = new UserDetails({
        githubId: profile.id,
        username: profile.username, 
        profileUrl : profile.profileUrl
      });

      const savedUser = await newUser.save();
      done(null, savedUser);
    }
  } catch (err) {
    console.error(err);
    done({ duplicateKeyError: true }, null);
  }
}));

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: `${BASE_URL}/signup`}),
  function(req, res) {
    res.redirect(`${BASE_URL}/dummy`);
  }
 
);

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(BASE_URL);
  });
});


module.exports =  router;