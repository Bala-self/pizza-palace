const express   = require('express');
const router    = express.Router();
const { body }  = require('express-validator');

const { register, login, getProfile, updateProfile } = require('../controllers/authController');

const { verifyToken } = require('../middleware/authMiddleware');

//---------------registerRules-------------------------------- Validation Rules 


const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
];

//---------------loginRules-------------------------------- Validation Rules 

const loginRules = [
  body('email')
    .isEmail()
    .withMessage('Valid email required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

//------------------------------------------ROUTES  

router.post('/register', registerRules, register);


router.post('/login', loginRules, login);


router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;

