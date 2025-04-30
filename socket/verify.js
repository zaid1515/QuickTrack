const jwt = require("jsonwebtoken");

const verifyJWT = (token) => {
  if (!token) throw new Error("No token provided");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in .env");

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
};

module.exports = { verifyJWT };
