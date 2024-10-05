const { SEARCHHELP } = require("../../HELP/index.js");

const SearchREQ = (req, res) => {
  return res.status(200).json(SEARCHHELP);
};

module.exports = SearchREQ;
