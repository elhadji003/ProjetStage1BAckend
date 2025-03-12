const User = require("../models/myUsers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Fonction pour vérifier si l'utilisateur existe déjà
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = await req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ fullName, email, password: hashedPassword });

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


function sendResetPasswordEmail(user, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "piodlords03@gmail.com",
      pass: "cqce yoyv sbje mvim",
    },
  });

  const mailOptions = {
    from: "piodlords03@gmail.com",
    to: user.email,
    subject: "Réinitialisation de mot de passe",
    text: `Bonjour ${user.fullName},

    Vous avez demandé une réinitialisation de mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :
    
    http://localhost:3000/gmailPwd/${token}
    
    Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.

    Cordialement,
    RED PRODUCT`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email envoyé: " + info.response);
    }
  });
}

// Contrôleur pour la demande de réinitialisation de mot de passe
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé !" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "1h", // Durée de validité du token de réinitialisation
    });

    sendResetPasswordEmail(user, token);

    res.status(200).json({
      message: "Un e-mail de réinitialisation de mot de passe a été envoyé.",
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la demande de réinitialisation de mot de passe." });
  }
};

// Contrôleur pour la soumission du formulaire de réinitialisation de mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Error during reset password:", error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la réinitialisation du mot de passe." });
  }
};


module.exports = {
  registerUser,
  getUserById,
  loginUser,
  forgotPassword,
  resetPassword,
};

