const bcrypt = require("bcryptjs");

const hash = (value) => bcrypt.hashSync(value);
const compare = (value, hash) => bcrypt.compareSync(value, hash);

module.exports = { hash, compare };