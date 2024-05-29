const Image = require("../models/schema");
const expressHandler = require("express-async-handler");

const createImage = expressHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(500).json({ error: "No file found" });
    }

    const imageFile = new Image({
      // filename: req.file.filename, 
      filepath: req.file.filepath,
      filename: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    });

    const savedImage = await imageFile.save();

    res.status(200).json({ savedImage });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
});

const updImage = async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createImage,
  updImage
};
