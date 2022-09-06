const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} = require("../controller/user");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/allUsers", protect, getUsers);

router.route("/user/:id").get(protect, getUser);

router.route("/user/:id").put(protect, updateUser);

router.route("/user/:id").delete(protect, deleteUser);

module.exports = router;
