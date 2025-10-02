const router = require('express').Router()
const { createFood } = require('../Controller/foodcontrollers');
const upload = require('../middlewares/multer');


// Add food route
router.post('/add-food', upload.single('image'), createFood);

module.exports = router;