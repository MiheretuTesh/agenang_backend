const jwt = require("jsonwebtoken");

const secret =
  process.env.NODE_ENV === "production" ? process.env.JWT_SECRET : "secret";

const authService = () => {
  const generateToken = (payload) =>
    jwt.sign(payload, secret, { expiresIn: 1000000000000 });

  const verifyToken = (token, cb) => jwt.verify(token, secret, {}, cb);

  return {
    generateToken,
    verifyToken,
  };
};

module.exports = authService;
