const jwt = require("jsonwebtoken");
const JWT_SECRET = "goodjob";
const Fetchuser = (req, res, next) => {
  const token = req.header("JWT_token");
  if (!token) {
    res.status(401).send("Unauthorized Access....The token is invalid");
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    // console.error(error.message)
    res.status(401).json("Unauthorized Access....The token is invalid");
  }
};
module.exports = Fetchuser;
