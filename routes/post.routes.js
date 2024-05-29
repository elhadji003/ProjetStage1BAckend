const express = require('express');
const {
  getHotels,
  deleteHotel,
  createHotel,
} = require('../controllers/post.controler'); 
const multer = require('../middlewares/multer-config')

const router = express.Router();

router.post('/', multer, createHotel);
router.get('/', getHotels);
router.delete('/:id', deleteHotel);


module.exports = router;
