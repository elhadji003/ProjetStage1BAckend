const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', imageSchema)