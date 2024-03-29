const express = require('express');
const app = express();
const authRoute = require("./routes/auth");
const GoogleAuthRoute = require("./routes/oauth");
const userPayment = require("./routes/payment")
const dBconnect = require("./db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const UserDetails = require('./models/UserDetails');
const uploadDetails = require("./routes/details");
const cloudinary = require("./utils/cloudinary");
const fileUpload = require("express-fileupload")
const BASE_URL = process.env.BASE_URL

require('dotenv').config();

// middlewares
app.use(cors(`${BASE_URL}`));
// app.use(cors(`http://localhost:3000`));

app.use(cookieParser());
app.use(express.json());


 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: {
        maxAge: 86400000,
    },
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

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/user",uploadDetails);
app.use("/api/v1/user/payment",userPayment);
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
    cloudinary.cloudinaryConnect();
    console.log("Connected to backend");
})