const express = require('express');
const router = express.Router();
const { register, login, googleMobile } = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');


router.post('/register', register);
router.post('/login', login);
router.post('/google/mobile', googleMobile);

// 👇 Rutas de Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Generamos el JWT con los datos del usuario
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });

    // Redirigimos al frontend con el token en la URL
    const clientUrl = process.env.CLIENT_URL?.startsWith('http')
      ? process.env.CLIENT_URL
      : `https://${process.env.CLIENT_URL}`;
    res.redirect(`${clientUrl}/auth/callback?token=${token}&user=${encodeURIComponent(user)}`);
  }
);

module.exports = router;