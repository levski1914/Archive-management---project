const User = require("../models/User");
const Company = require("../models/Company");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;

    // Създаване на компания
    const company = new Company({ name: companyName });
    await company.save();

    // Хаширане на паролата
    const hashedPassword = await bcrypt.hash(password, 10);

    // Създаване на администратор
    const admin = new User({
      name,
      email,
      password,
      role: "admin",
      companyId: company._id,
    });

    await admin.save();

    // Създаване на токен
    const token = jwt.sign(
      { id: admin._id, role: admin.role, companyId: company._id },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      token,
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

exports.login = async (req, res) => {
  try {
    const { email, password, companyName } = req.body;

    // Намери компанията по нейното име
    const company = await Company.findOne({ name: companyName });
    if (!company) {
      console.log("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Намери потребителя по email и companyName (временно)
    const user = await User.findOne({ email, companyId: company._id }); // Добавяме companyId от намерената компания
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("User found:", user);

    // Проверка на паролата
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Генериране на токен
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        companyId: company._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error logging in", error: err });
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
