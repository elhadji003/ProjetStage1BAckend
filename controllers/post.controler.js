const Hotel = require('../models/hotelSchema');

const createHotel = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Affiche les données reçues depuis le formulaire
    console.log("Request File:", req.file); // Affiche le fichier reçu depuis le formulaire

    if (!req.file) {
      console.log("Image not found"); // Affiche si aucune image n'est trouvée
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

    // Utilisation de la méthode statique create pour créer et enregistrer le document
    const newHotel = await Hotel.create(hotelData);

    res.status(200).json(newHotel);

  } catch (error) {
    console.error("Error creating hotel:", error); // Affiche l'erreur en cas d'échec de la création d'un hôtel
    res.status(500).json({ message: error.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.status(200).json(hotels);
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

module.exports = {
  getHotels,
  createHotel,
  deleteHotel,
};
