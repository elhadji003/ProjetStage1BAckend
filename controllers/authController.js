const User = require('../models/myUsers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Fonction pour vérifier si l'utilisateur existe déjà
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    req.session.userId = user._id;

    return res.status(200).json({ 
      id: user._id,
      email: user.email,
      name: user.fullName,
      token: token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'An error occurred while logging in the user.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.fullName,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'An error occurred while fetching the user.' });
  }
};

const sendResetPasswordEmail = (user, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Réinitialisation de mot de passe',
    text: `Bonjour ${user.fullName},

    Vous avez demandé une réinitialisation de mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :
    
    http://localhost:3000/reset-password/${token}
    
    Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.

    Cordialement,
    RED PRODUCT`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email envoyé: ' + info.response);
    }
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: '1h',
    });

    sendResetPasswordEmail(user, token);

    res.status(200).json({ message: 'Un e-mail de réinitialisation de mot de passe a été envoyé.' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la demande de réinitialisation de mot de passe.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error('Error during reset password:', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.' });
  }
};

const logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ error: 'Error destroying session' });
    } else {
      res.redirect('/login'); // Rediriger l'utilisateur vers la page de connexion
    }
  });
};

const getProfile = async (req, res) => {
  try {
    // Vérifiez si l'utilisateur est connecté
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Récupérez l'ID de l'utilisateur connecté
    const userId = req.session.userId;

    // Recherchez l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifiez si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retournez les informations du profil de l'utilisateur
    res.status(200).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      // Ajoutez d'autres informations du profil si nécessaire
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'An error occurred while fetching user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  forgotPassword,
  resetPassword,
  logOut,
  getProfile,
};
