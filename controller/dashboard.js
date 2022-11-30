const jwt_decode = require("jwt-decode");
const User = require("../models/user");
const authService = require("../services/auth.service");
const House = require("../models/house");

const getDashboardData = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const decoded = jwt_decode(token);

    const id = decoded.id;

    const user = await User.findOne({
      where: { id },
      include: [{ model: House }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: `User does not exist`, status: 400, error: true });
    }

    let images = [];
    user.Houses.forEach((house) => {
      if (house.images) {
        images = house.images.split(",");
        delete house.images;
        house.images = images;
      }
    });

    user.Houses.sort(function (a, b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server Error" });
  }
};

module.exports = { getDashboardData };
