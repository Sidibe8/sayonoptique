const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  const { nom, prenom, email, password, role = 'gestionnaire', cabinetId = null } = req.body;

  try {
    // Validation
    if (role === 'admin' && cabinetId) {
      return res.status(400).json({ message: 'Un admin ne peut pas être assigné à un cabinet' });
    }

    if (role === 'gestionnaire' && !cabinetId) {
      return res.status(400).json({ message: 'Un gestionnaire doit être assigné à un cabinet' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      nom, 
      prenom, 
      email, 
      password: hashedPassword, 
      role, 
      cabinetId 
    });

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        cabinetId: user.cabinetId
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
  
      // On supprime les mots de passe avant d'envoyer la réponse
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
  
      res.json(usersWithoutPasswords);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, ...updates } = req.body;
  
      // Vérifier que l'utilisateur ne peut mettre à jour que son mot de passe et cabinetId
      const allowedUpdates = {};
      
      // Vérification du mot de passe actuel si changement de mot de passe demandé
      if (updates.password) {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        if (!currentPassword) {
          return res.status(400).json({ message: 'Le mot de passe actuel est requis pour changer le mot de passe' });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }
        
        allowedUpdates.password = await bcrypt.hash(updates.password, 10);
      }
  
      // Vérification pour cabinetId
      if (updates.cabinetId) {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
  
        // Seuls les gestionnaires peuvent modifier leur cabinetId
        if (user.role !== 'gestionnaire') {
          return res.status(403).json({ message: 'Seuls les gestionnaires peuvent modifier leur cabinet' });
        }
  
        allowedUpdates.cabinetId = updates.cabinetId;
      }
  
      // Mettre à jour uniquement les champs autorisés
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
      );
  
      const { password, ...userWithoutPassword } = updatedUser.toObject();
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await User.delete(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};