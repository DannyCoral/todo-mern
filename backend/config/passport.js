const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://todo-mern-production-8361.up.railway.app/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscamos si el usuario ya existe
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user); // ya existe, lo devolvemos
        }

        // Si no existe lo creamos
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'google-oauth', // no usará contraseña
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;