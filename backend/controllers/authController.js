const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, fitnessLevel, wellnessGoals, agreedToTerms } = req.body;

    // 1. Check if the user already exists in the database
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'A user with this email already exists.' 
      });
    }

    // 2. Hash the password
    // Generate a 'salt' (random data) to make the hash more secure
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new User instance
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword, // Store the hashed version, not the plain text
      fitnessLevel,
      wellnessGoals,
      agreedToTerms
    });

    // 4. Save to MongoDB
    const savedUser = await newUser.save();

    // 5. Send success response (excluding password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

module.exports = { registerUser };