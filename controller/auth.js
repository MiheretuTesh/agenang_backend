const User = require("../models/user");
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, phoneNumber } = req.body;

  if (password === confirmPassword) {
    try {
      if (!phoneNumber) {
        return res.status(400).json({ msg: "phone number is required" });
      }
      if (!email) {
        return res.status(400).json({ msg: "Email is required" });
      }
      if (!name) {
        return res.status(400).json({ msg: "Name is required" });
      }
      if (!password) {
        return res.status(400).json({ msg: "Password is required" });
      }
      const [user, created] = await User.findOrCreate({
        where: { email: email, phoneNumber: phoneNumber },
        defaults: {
          name: name,
          email: email,
          password: password,
          phoneNumber: phoneNumber,
        },
      });

      if (created) {
        const token = authService().generateToken({ id: user.id });
        return res.status(200).json({ token, user });
      }

      return res.status(403).json({ msg: "user already exists" });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        return res.status(400).json({ msg: err.errors[0].message });
      } else {
        return res.status(500).json({ msg: "Internal server error", err });
      }
    }
  } else {
    return res.status(400).json({ msg: "Password does not match" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    if (!phoneNumber) {
      res.status(400).json({ msg: "Phone Number is required" });
    }

    if (!email) {
      res.status(400).json({ msg: "Email is required" });
    }

    if (!password) {
      res.status(400).json({ msg: "Password is required" });
    }

    if (email && password && phoneNumber) {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      if (bcryptService().comparePassword(password, user.password)) {
        const token = authService().generateToken({ id: user.id });

        return res.status(200).json({ token, user });
      }
      return res.status(400).json("Email or password not correct");
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
  } catch (err) {}
};
