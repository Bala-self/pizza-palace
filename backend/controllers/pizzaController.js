const Pizza = require('../models/pizza');
const { validationResult } = require('express-validator');


const getAllPizzas = async (req, res, next) => {
  try {
    const filter = {};

    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      filter.isAvailable = true;
    }

    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const pizzas = await Pizza.find(filter).sort('-createdAt');
    res.status(200).json({ success: true, count: pizzas.length, pizzas });
  } catch (error) {
    next(error);
  }
};

//--------------------------------- GET SINGLE PIZZA
const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, pizza });
  } catch (error) {
    next(error);
  }
};

//--------------------------------------- CREATE PIZZA (admin)
const createPizza = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, message: 'Pizza created successfully', pizza });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------UPDATE PIZZA (admin)
const updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, message: 'Pizza updated successfully', pizza });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------- DELETE PIZZA (admin)
const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, message: 'Pizza deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPizzas, getPizzaById, createPizza, updatePizza, deletePizza };