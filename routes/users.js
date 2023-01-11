const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/Users');

// @router      POST api/users
// @desc        Register Users
// @access      Public
router.post(
  '/',
  [
    // express validation and validation examples
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6
    })
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
    const { name, email, password } = req.body;

    try {
      // See if user exists, 'findOne()' returns a promise
      let user = await User.findOne({
        email
      });

      // If user already exists throw error
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User already exist'
            }
          ]
        });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Create new user
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // 'rounds = 10' the higher the round the secure it is.
      const salt = await bcrypt.genSalt(10);

      // Encrypt password
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        // Moongoose provides the abstration of 'id' as in mongodb its '_id'
        // see mongodb document for '_id', hence 'user.id' can be used.
        user: {
          id: user.id
        }
      };

      // Return jsonwebtoken
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          // Token expiry
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
