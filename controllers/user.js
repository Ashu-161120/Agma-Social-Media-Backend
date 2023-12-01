import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";
const SECRET = "test";

// Controller for user sign-in
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the provided email exists
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id }, 
      SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Controller for user sign-up
export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Check if the user with the provided email already exists
    const oldUser = await UserModal.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with hashed password
    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    // Generate a JWT token for the newly created user
    const token = jwt.sign(
      { email: result.email, id: result._id },
      SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

// Controller to view user profile
export const viewProfile = async (req, res) => {
  try {
    // Fetch the user's profile based on their user ID
    const user = await UserModal.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ result: user });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Controller to update user profile
export const updateProfile = async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    // Fetch the user by their user ID
    const user = await UserModal.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's data
    user.name = `${firstName} ${lastName}`;
    const updatedUser = await user.save();

    res.status(200).json({ result: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: "Something went wrong" });
  }
};
