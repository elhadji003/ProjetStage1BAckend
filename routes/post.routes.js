const express = require('express');
const {
  getHotels,
  deleteHotel,
  createHotel,
} = require('../controllers/post.controler'); 
const { upload } = require('../middlewares/multer-config');
const { createImage, updImage } = require('../controllers/imageController');

const router = express.Router();

router.post('/', createHotel);
router.get('/', getHotels);
router.delete('/:id', deleteHotel);
router.post("/creerImage", upload.single("image"), createImage);
router.get("/updImage", updImage);


module.exports = router;
