const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { companyId } = req.user;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      companyId,
    });

    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Email is already used in this company",
      });
    } else {
      res.status(500).json({ message: "Error adding user", error });
    }
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { companyId } = req.user;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({ companyId }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { companyId } = req.user;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userToDelete = await User.findOne({ _id: userId, companyId });

    if (!userToDelete) {
      return res.status(404).json({ message: "user not found" });
    }
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting users", error });
  }
};
