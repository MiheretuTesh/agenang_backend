const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers["x-access-token"] &&
    req.headers["x-access-token"].startsWith("Bearer")
  ) {
    token = req.headers["x-access-token"].split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ msg: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded.id;
    req.user = await User.findOne({ where: { id } });

    next();
  } catch (err) {
    return res.status(500).json({ msg: "Internal server Error" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
