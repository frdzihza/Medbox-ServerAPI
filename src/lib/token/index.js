const jwt = require("jsonwebtoken");
const SECRET_WORD = "Medbox";

const createToken = (payload) => jwt.sign(payload, SECRET_WORD);
const verifyToken = (token) => jwt.verify(token, SECRET_WORD);

module.exports = { createToken, verifyToken };