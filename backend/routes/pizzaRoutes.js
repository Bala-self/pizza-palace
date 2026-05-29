const express = require("express");
const { body } = require("express-validator");
const router  = express.Router();
const jwt     = require('jsonwebtoken');

const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} = require("../controllers/pizzaController");

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

//-----------------------verify auth

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch {
    }
  }
  next();
};

//--------------------------create pizza roles 

const pizzaRules = [
  body('name').notEmpty().withMessage('Name is required'),



  body('description').notEmpty().withMessage('Description is required'),



  body('price')
    .isNumeric().withMessage('Price must be a number')
    .custom(v => Number(v) > 0).withMessage('Price must be greater than 0'),


  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Veg', 'Non-Veg', 'Specialty']).withMessage('Category must be Veg, Non-Veg, or Specialty'),


  body('imageUrl')
    .notEmpty().withMessage('Image URL is required')
    .isURL({ require_tld: false }).withMessage('Image URL must be a valid URL'),

];

//-----------------------routes

router.get('/',    optionalAuth, getAllPizzas);
router.get('/:id', optionalAuth, getPizzaById);


router.post('/',      verifyToken, isAdmin, pizzaRules, createPizza);
router.put('/:id',    verifyToken, isAdmin,             updatePizza);
router.delete('/:id', verifyToken, isAdmin,             deletePizza);


module.exports = router;

