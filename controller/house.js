const House = require("../models/house");
const User = require("../models/user");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Op } = require("sequelize");

exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll({ include: [{ model: User }] });

    return res.status(200).json({ houses });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getHouse = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const house = await House.findOne({
      where: { id },
      include: [{ model: User }],
    });
    console.log(house, "house");
    if (!house) {
      return res.status(400).json({
        msg: `House with ID ${id} does not exist`,
        status: 400,
        error: true,
      });
    }
    return res.status(200).json({ house });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server Error" });
  }
};

exports.createHouse = async (req, res) => {
  req.body.userId = req.user.id;

  const temp = [];
  for (let i = 0; i < req.files.length; i++) {
    const imageName = req.files[i].path.split("\\");
    temp.push(imageName[imageName.length - 1]);
  }
  const images = temp.join();
  const id = req.body.userId;
  try {
    const user = await User.findOne({ where: id });
    if (!user) {
      return res.status(400).json({ msg: `User with ${id} does not exist` });
    }

    const {
      bedNo,
      location,
      floor,
      monthlyPayment,
      phoneNumber,
      availabilityDate,
      guestHouse,
      description,
      status,
      userId,
      listingStatus,
      reviewStatus,
    } = req.body;

    if (!bedNo) {
      return res.status(400).json({ msg: "Bed Number is required" });
    }

    if (!location) {
      return res.status(400).json({ msg: "Location is required" });
    }

    if (!floor) {
      return res.status(400).json({ msg: "Floor is required" });
    }

    if (!monthlyPayment) {
      return res.status(400).json({ msg: "Monthly Payment is required" });
    }

    if (!phoneNumber) {
      return res.status(400).json({ msg: "Phone Number is required" });
    }

    if (!availabilityDate) {
      return res.status(400).json({ msg: "Availability Date is required" });
    }

    if (!guestHouse) {
      return res.status(400).json({ msg: "Guest House is required" });
    }

    if (!description) {
      return res.status(400).json({ msg: "Description is required" });
    }

    if (!listingStatus) {
      return res.status(400).json({ msg: "Listing Status is required" });
    }

    if (!reviewStatus) {
      return res.status(400).json({ msg: "Review Status is required" });
    }

    const house = await House.create({
      bedNo: bedNo,
      location: location,
      floor: floor,
      monthlyPayment: monthlyPayment,
      phoneNumber: phoneNumber,
      availabilityDate: availabilityDate,
      guestHouse: guestHouse,
      description: description,
      status: status,
      userId: userId,
      listingStatus: listingStatus,
      reviewStatus: reviewStatus,
      images: images,
    });

    return res.status(200).json({ house });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.updateHouse = async (req, res) => {
  const id = req.params.id;

  let temp = [];
  let images;
  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      const imageName = req.files[i].path.split("\\");
      temp.push(imageName[imageName.length - 1]);
    }
  }
  images = temp.join();

  try {
    let house;
    house = await House.findOne({ where: { id } });
    if (house) {
      if (req.files) {
        req.body.images = images;
        house = await House.update(req.body, { where: { id: id } });
      } else {
        house = await House.update(req.body, { where: { id: id } });
      }
      if (house[0]) {
        res.status(200).json({ msg: "House Updated Successfully" });
      } else {
        res.status(404).json({ msg: `House Update Failed` });
      }
    } else {
      res.status(404).json({ msg: `House with ID ${id} not found` });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteHouse = async (req, res) => {
  const id = req.params.id;

  try {
    const house = await House.update(
      {
        status: false,
      },
      { where: { id: id } }
    );

    if (house[0]) {
      return res.status(200).json({ msg: `Successfully Updated` });
    } else {
      return res
        .status(404)
        .json({ msg: `House with ID ${id} does not exist` });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateStatus = async (req, res) => {
  const id = req.params.id;

  try {
    let house;
    house = await House.findOne({ where: { id } });
    if (house) {
      if (req.body.listingStatus === "Submit") {
        house = await House.update(
          { listingStatus: "Submit" },
          { where: { id: id } }
        );
        if (house[0]) {
          return res.status(200).json({ msg: `Successfully Updated` });
        } else {
          return res.status(404).json({ msg: `House Update Failed` });
        }
      }
      if (req.body.listingStatus === "Draft") {
        house = await House.update(
          { listingStatus: "Draft" },
          { where: { id: id } }
        );
        if (house[0]) {
          return res.status(200).json({ msg: `Successfully Updated` });
        } else {
          return res.status(404).json({ msg: `House Update Failed` });
        }
      }
    } else {
      return res.status(404).json({ msg: `House with ID ${id} not found.` });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Search House by location

exports.searchByLocation = async (req, res) => {
  const searchParam = req.query.search;

  try {
    const houses = await House.findAll({
      where: { location: { [Op.like]: "%" + searchParam + "%" } },
    });

    if (houses) {
      return res.status(200).json({ msg: houses });
    }

    return res.status(400).json({ msg: "Error Occurred" });
  } catch (err) {
    res.status(500).json({ msg: "Error while searching" });
  }
};

// Upload Image controller

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(path.join("public/images", req.user.email), function () {
      cb(null, path.join("public/images", req.user.email));
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).array("images", 6);
