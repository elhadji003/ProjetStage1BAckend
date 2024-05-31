const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fonction pour vérifier si l'utilisateur existe déjà
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = await req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await User.create({ fullName, email, password: hashedPassword });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "An error occurred while registering the user." });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "An error occurred while fetching the user." });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Vérification du mot de passe
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    return res.status(200).json({ 
      id: user._id,
      email: user.email,
      name: user.fullName
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "An error occurred while logging in the user." });
  }
};

module.exports = {
  registerUser,
  getUserById,
  loginUser,
};
