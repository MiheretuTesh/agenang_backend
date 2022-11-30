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
  console.log(req.body, "User Data");
  try {
    if (req.body.email) {
      const { email, name, photo } = req.body;

      console.log(email, name, photo, "is created");

      if (!email && !name) {
        return res.status(400).json({ msg: "Email is required" });
      }

      if (email) {
        const [user, created] = await User.findOrCreate({
          where: { email },
          defaults: {
            name: name,
            email: email,
            photo: photo,
          },
        });

        if (!user) {
          return res.status(400).json({ msg: "User not found" });
        }

        const token = authService().generateToken({ id: user.id });

        if (user.email === "mercytt5775@gmail.com") {
          return res.status(200).json({ token, user, isAdmin: "admin" });
        } else {
          return res.status(200).json({ token, user, isAdmin: null });
        }
      }
    }
    if (req.body.phoneNumber) {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ msg: "phoneNumber is required" });
      }

      if (phoneNumber) {
        const [user, created] = await User.findOrCreate({
          where: { phoneNumber },
          defaults: {
            phoneNumber: phoneNumber,
          },
        });

        console.log(user, "user created");

        if (!user) {
          return res.status(400).json({ msg: "User not found" });
        }

        const token = authService().generateToken({ id: user.id });

        if (user.phoneNumber === "+251965195775") {
          return res.status(200).json({ token, user, isAdmin: "admin" });
        } else {
          return res.status(200).json({ token, user, isAdmin: null });
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
  } catch (err) {}
};
