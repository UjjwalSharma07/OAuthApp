const express = require('express');
const app = express();
const authRoute = require("./routes/auth");
const GoogleAuthRoute = require("./routes/oauth");
const dBconnect = require("./db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const UserDetails = require('./models/UserDetails');
const BASE_URL = process.env.BASE_URL

require('dotenv').config();

//middlewares
app.use(cors({ origin: `${BASE_URL}` }));

app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((userId, done) => {
    UserDetails.findById(userId)
      .then(user => {
        done(null, user);
      });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use("/api/v1/auth",authRoute);
app.use("/",GoogleAuthRoute);

app.use((err,req,res,next)=>{
    errorStatus = err.status || 500
    errorMessage = err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    });
})
const PORT = process.env.PORT || 8800
app.listen(PORT,()=>{
    dBconnect();
    console.log("Connected to backend");
})