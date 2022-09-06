const User = require("../models/user");
const authService = require("../services/auth.service");
const House = require("../models/house");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: House }] });

    return res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      where: { id },
      include: [{ model: House }],
    });
    if (!user) {
      return res.status(400).json({
        msg: `User with ID ${id} does not exist`,
        status: 400,
        error: true,
      });
    }
    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Internal server Error" });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, confirmPassword, phoneNumber } = req.body;

  if (password === confirmPassword) {
    try {
      const user = await User.create({
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      });
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ msg: "Internal sever error" });
    }
  } else {
    res.status(400).json({ msg: "Password does not match" });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const id = req.params.id;

  try {
    const user = await User.update(
      {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      },
      { where: { id: id } }
    );
    if (user[0]) {
      res.status(200).json({ msg: "Successfully Updated" });
    } else {
      res.status(404).json({ msg: "User does not exist" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.update(
      {
        status: false,
      },
      {
        where: { id: id },
      }
    );
    if (user[0]) {
      return res.status(200).json({ msg: "User deleted successfully" });
    } else {
      return res.status(400).json({ msg: `User with ID ${id} does not exist` });
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal Server error" });
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
