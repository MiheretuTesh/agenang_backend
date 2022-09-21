const express = require("express");
const {
  getAllHouses,
  getHouse,
  createHouse,
  updateHouse,
  deleteHouse,
  updateStatus,
  searchByLocation,
  filterHouse,
  upload,
} = require("../controller/house");

const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/houses").get(getAllHouses);

router.route("/houses/search").get(searchByLocation);

router.route("/houses/filter").get(filterHouse);

router.route("/house/:id").get(getHouse);

router.route("/house").post(protect, upload, createHouse);

router.route("/house/:id").put(protect, updateHouse);

router.route("/houseUpdateStatus/:id").put(protect, updateStatus);

router.route("/house/:id").delete(protect, deleteHouse);

module.exports = router;
