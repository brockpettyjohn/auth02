const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , cors = require('cors')
    , config=require('./config.js')

const app = express();

app.use(cors());

app.use(session({
    secret: 'effbeyonce',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: config.domain,
    clientID: config.clientID, 
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL //this tells them where to push them once it it suthenticated just and endpoint on your server
}, function (accessToken, refreshToken, extraParams, profile, done) {
    console.log(profile)
    done(null, profile);
}));

app.get('/auth/me', (req, res) => {
    if(!req.user) {
        return res.status(401).send('no user found')
    }
    return res.status(200).send(req.user)
})

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
    successredirect: 'http://localhost:3000/',
    failureRedirect: '/auth'
}))

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})


const PORT = 3000
app.listen(PORT, () => console.log(`Listening in on port ${PORT}`))