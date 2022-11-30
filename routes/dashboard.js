const express = require("express");

const { getDashboardData } = require("../controller/dashboard");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/houses").get(protect, getDashboardData);

module.exports = router;
