const House = require("../models/house");
const User = require("../models/user");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Op } = require("sequelize");

exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll({
      where: { status: true },
      include: [{ model: User }],
    });

    let images = [];
    houses.forEach((house) => {
      if (house.images) {
        images = house.images.split(",");
        delete house.images;
        house.images = images;
      }
    });

    houses.sort(function (a, b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return res.status(200).json({ houses });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getHouse = async (req, res) => {
  try {
    const id = req.params.id;
    const house = await House.findOne({
      where: { id, status: true },
      include: [{ model: User }],
    });
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

let houseId;

exports.createHouse = async (req, res) => {
  req.body.userId = req.user.id;

  // const temp = [];
  // let images;

  // if (req.files) {
  // for (let i = 0; i < req.files.length; i++) {
  //   const imageName = req.files[i].path.split("\\");
  //   temp.push(imageName[imageName.length - 1]);
  // }
  // images = temp.join();
  // }
  // else {
  // }

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
      userId,
      listingStatus,
      reviewStatus,
      images,
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
      userId: userId,
      listingStatus: listingStatus,
      reviewStatus: reviewStatus,
      images: images ? images : "",
    });

    houseId = house.id.toString();

    return res.status(200).json({ house });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error", error: err });
  }
};

exports.updateHouse = async (req, res) => {
  const id = req.params.id;

  // let temp = [];
  // let images;
  // if (req.files) {
  //   for (let i = 0; i < req.files.length; i++) {
  //     const imageName = req.files[i].path.split("\\");
  //     temp.push(imageName[imageName.length - 1]);
  //   }
  // }
  // images = temp.join();

  try {
    let house;
    house = await House.findOne({ where: { id } });
    if (house) {
      // if (req.body.houseImageUpdated) {
      //   console.log(id);
      //   const images = house.images.split(",");

      // images.forEach((image) => {
      //   fs.unlinkSync(
      //     "./public/images/" + req.user.email + "/" + req.user.email + image,
      //     (err) => {
      //       if (err) {
      //         res.status(500).json({ msg: "Couldn't delete file." + err });
      //       }
      //       console.log("Delete File successfully.");
      //     }
      //   );
      // });
      // }
      house = await House.update(req.body, { where: { id: id } });
      // if (req.files) {
      //   req.body.images = images;
      //   house = await House.update(req.body, { where: { id: id } });
      // } else {
      //   house = await House.update(req.body, { where: { id: id } });
      // }
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
      where: { location: { [Op.like]: "%" + searchParam + "%" }, status: true },
    });

    if (houses) {
      return res.status(200).json({ msg: houses });
    }

    return res.status(400).json({ msg: "Error Occurred" });
  } catch (err) {
    res.status(500).json({ msg: "Error while searching" });
  }
};

exports.filterHouse = async (req, res) => {
  let location;
  location = req.query.location;
  const locationLst = location.split(",");

  let price;
  price = req.query.price;
  const priceLst = price.split(",");

  let bedNo;
  bedNo = req.query.bedNo;
  const bedNoLst = bedNo.split(",");

  let isGuestHouse = req.query.isGuestHouse;

  try {
    const houses = await House.findAll({
      where: {
        location: { [Op.in]: locationLst },
        monthlyPayment: {
          [Op.or]: { [Op.gte]: priceLst[0] + 1, [Op.lte]: priceLst[1] - 1 },
        },
        bedNo: {
          [Op.in]: bedNoLst,
        },
        guestHouse: isGuestHouse,
      },
    });
    res.status(200).json({ msg: houses });
  } catch (err) {
    return res.status(500).json({ msg: "Error Occurred" });
  }
};

// Upload Image controller

exports.uploadHouseImages = async (req, res) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdir(
        path.join(
          "public/images",
          req.user.email ? req.user.email : req.user.phoneNumber
        ),
        function () {
          cb(
            null,
            path.join(
              "public/images",
              req.user.email ? req.user.email : req.user.phoneNumber
            )
          );
        }
      );
    },
    filename: (req, file, cb) => {
      console.log(path.basename(file.originalname), req.body.houseId);
      cb(
        null,
        req.user.email
          ? req.user.email
          : req.user.phoneNumber + path.basename(file.originalname)
        // + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
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
  }).array("files[]", 6);
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.file, "req.file");

      res.send("Success");
    }
  });
};
