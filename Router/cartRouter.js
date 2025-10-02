const { addCart } = require('../Controller/cartController');

const router = require('express').Router;

router.get('/add-to-cart', addCart)