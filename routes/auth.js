const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "goodjob";
const Fetchuser = require("../middleware/Fetchuser");
// Creating a user
router.post(
  "/createuser",
  [
    body("name", "Enter the name having a valid length of 3").isLength({
      min: 3,
    }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid length password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Erros to find
    if (!errors.isEmpty()) {
      success = "true";
      return res.status(400).json({ success, errors: errors.array() });
    }
    // Check if the user exits
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = "false";
        return res.status(400).json({
          success,
          errors:
            "A user with the same email exists so please Enter the unique value",
        });
      }
      //   Secure Password
      const salt = await bcrypt.genSalt(10);
      const sec_password = await bcrypt.hash(req.body.password, salt);
      // Insert to the Database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: sec_password,
      });
      //   JWT
      data = {
        user: {
          id: user.id,
        },
      };
      const JWT_token = jwt.sign(data, JWT_SECRET);
      //   console.log(JWT_token);
      // Response
      success = "true";
      res.json({ success, JWT_token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error has been occured on the server");
    }
  }
);
// Authenticate a user
router.post(
  "/login",
  [
    body("email", "Enter the valid email address").isEmail(),
    body("password", "Password can't be blanked").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Erros to find
    if (!errors.isEmpty()) {
      sucess = false;
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        res.status(400).json({ success, errors: "Invalid email and password" });
      } else {
        const password_comp = await bcrypt.compare(password, user.password);
        if (!password_comp) {
          success = false;
          res
            .status(400)
            .json({ success, errors: "Invalid email and password" });
        } else {
          data = {
            user: {
              id: user.id,
            },
          };
          const JWT_token = jwt.sign(data, JWT_SECRET);
          console.log(JWT_token);
          // Response
          success = true;
          res.json({ success, JWT_token });
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Login Details
router.post("/getuser", Fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
