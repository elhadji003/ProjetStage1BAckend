const Hotel = require('../models/hotelSchema');

const createHotel = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the data received from the form
    console.log("Request File:", req.file); // Log the file received from the form

    if (!req.file) {
      console.log("Image not found"); // Log if no image is found
      return res.status(404).json('Image not found');
    }

    const hotelData = {
      nameHotel: req.body.nameHotel,
      address: req.body.address,
      email: req.body.email,
      number: req.body.number,
      price: req.body.price,
      devise: req.body.devise,
      image: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    };

    const newHotel = await Hotel.create(hotelData);
    res.status(200).json(newHotel);

  } catch (error) {
    console.error("Error creating hotel:", error); // Log the error if creating a hotel fails
    res.status(500).json({ message: error.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editHotel = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the data received from the form
    console.log("Request File:", req.file); // Log the file received from the form

    const hotelEdit = await Hotel.findById(req.params.id);


    const updateData = {
      nameHotel: req.body.nameHotel,
      address: req.body.address,
      email: req.body.email,
      number: req.body.number,
      price: req.body.price,
      devise: req.body.devise,
    };

    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
   

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelEdit, updateData, { new: true });
    res.status(200).json(updatedHotel);


    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

  } catch (error) {
    console.error("Error updating hotel:", error); // Log the error if updating a hotel fails
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  deleteHotel,
  editHotel,
};
