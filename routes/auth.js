const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

const { check, validationResult } = require('express-validator/check');

// @router      GET api/auth
// @desc        Test route
// @access      Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server Error');
  }
});

// @router      POST api/auth
// @desc        Authenticate user & get token
// @access      Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    // 'body' contents are available because of middleware,
    // see server.js for it "app.use(express.json({ extended: false }))"
    const { email, password } = req.body;

    try {
      // See if user exists, 'findOne()' returns a promise
      let user = await User.findOne({
        email
      });

      // If the user doesn't exist throw error 'User doesn't exist'
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials'
            }
          ]
        });
      }

      // JWT decrypting and matching password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials'
            }
          ]
        });
      }

      const payload = {
        // Moongoose provides the abstration of 'id' as in mongodb its '_id'
        // see mongodb document for '_id', hence 'user.id' can be used.
        user: {
          id: user.id
        }
      };

      // Implementing jsonwebtoken
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
