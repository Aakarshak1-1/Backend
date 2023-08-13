const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  obj = {
    name: "Shotri",
    rollno: 1,
  };
  res.json(obj);
});
module.exports = router;