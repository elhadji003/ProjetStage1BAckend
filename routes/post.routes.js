const express = require('express');
const {
  getHotels,
  deleteHotel,
  createHotel,
  editHotel,
  getHotelById,
} = require('../controllers/post.controler'); 
const multer = require('../middlewares/multer-config')

const router = express.Router();

router.post('/', multer, createHotel);

router.get('/', getHotels);

router.get('/:id', getHotelById);

router.delete('/:id', deleteHotel);

router.put('/:id', multer, editHotel);


module.exports = router;
