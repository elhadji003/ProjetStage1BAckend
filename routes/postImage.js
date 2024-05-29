const express = require("express");
const { createImage, updImage } = require("../controllers/imageController");
const { upload } = require("../middlewares/multer-config");


const router = express.Router();

router.post("/creerImage", upload.single("image"), createImage);
router.get("/updImage", updImage);

module.exports = router;
