const { createRestaurant, getAllRestaurants, getRestaurantById } = require('../Controller/restaurantcontroller')
const router = require('express').Router()
const upload = require('../middlewares/multer')

router.post('/restaurant',upload.single('image') ,createRestaurant)

router.get('/restaurants', getAllRestaurants)

router.get('/restaurant/:id', getRestaurantById)
module.exports = router