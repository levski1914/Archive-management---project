const User = require("../models/User");
const Company = require("../models/Company");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, companyId: user.companyId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;

    if (!companyName || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const company = new Company({ name: companyName });
    await company.save();

    const admin = new User({
      name,
      email,
      password,
      role: "admin",
      companyId: company._id,
    });
    await admin.save();

    const tokens = generateTokens(admin);

    res.status(200).json({
      ...tokens,
      user: { name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    if (err.code === 11000) {
      res
        .status(400)
        .json({ message: "Email is already used in this company" });
    } else {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error registering company", error: err });
    }
  }
};

// 🔹 Логин
exports.login = async (req, res) => {
  try {
    const { email, password, companyName } = req.body;

    const company = await Company.findOne({ name: companyName });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const user = await User.findOne({ email, companyId: company._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokens = generateTokens(user);
    res.status(200).json({ ...tokens, user });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error logging in", error: err });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { id } = req.params;
    const updateMe = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateMe) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updateMe);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// exports.updateFolder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedFolder = await Folder.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedFolder)
//       return res.status(404).json({ message: "Folder not found" });

//     res.status(200).json(updatedFolder);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating folder", error });
//   }
// };
