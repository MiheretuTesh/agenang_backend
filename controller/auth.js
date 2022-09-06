const User = require("../models/user");
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, phoneNumber } = req.body;

  if (password === confirmPassword) {
    try {
      console.log("first");
      // const userPhoneNumber = await User.findOne({
      //   where: { phoneNumber },
      // });
      // const userEmail = await User.findOne({
      //   where: { phoneNumber },
      // });

      // if (userExist) {
      //   return res.status(403).json({ msg: "User Exists" });
      // }
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
    console.log(email, password, phoneNumber);
    if (email && password && phoneNumber) {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(400).json("Bad request: User not found");
      }

      if (bcryptService().comparePassword(password, user.password)) {
        const token = authService().generateToken({ id: user.id });
        console.log(token);

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
