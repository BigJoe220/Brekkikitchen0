const router = require('express').Router()
const upload = require('../middlewares/multer');
const foodController = require('../Controller/foodcontrollers');

// Add food route
router.post('/add-food', upload.single('image'), foodController.createFood);

module.exports = router;