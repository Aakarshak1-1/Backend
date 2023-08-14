const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
router.post(
  "/",
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
      return res.status(400).json({ errors: errors.array() });
    }
    // Check if the user exits
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          errors:
            "A user with the same email exists so please Enter the unique value",
        });
      }
      // Insert to the Database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      // Response
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error has been occured on the server");
    }
  }
);
module.exports = router;
