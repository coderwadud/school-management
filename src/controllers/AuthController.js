import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "15m",
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    {
      expiresIn: "7d",
    }
  );
};

// Register API
export const register = async (req, res) => {
  try {
    const { userName, email, name, password } = req.body;

    // Validate input
    if (!userName || !email || !name || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      userName,
      email,
      name,
      password, // Will be hashed by pre-save hook
    });

    await newUser.save();

    // Generate tokens
    const token = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      data: {
        token,
        refreshToken,
        user: {
          email: newUser.email,
          name: newUser.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during registration",
      error: error.message,
    });
  }
};

// Login API
export const login = async (req, res) => {
  try {
    const { userName, password, rememberMe } = req.body;

    // Validate input
    if (!userName || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database if rememberMe is true
    if (rememberMe) {
      user.refreshToken = refreshToken;
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        refreshToken,
        user: {
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      error: error.message,
    });
  }
};

// Refresh Token API
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.query;

    // Validate input
    if (!token) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
      );
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Check if refresh token matches (if rememberMe was used)
    if (user.refreshToken && user.refreshToken !== token) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      message: "Token refreshed successfully",
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error refreshing token",
      error: error.message,
    });
  }
};
