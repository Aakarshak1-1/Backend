const express = require("express");
const router = express.Router();
const Fetchuser = require("../middleware/Fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
// Fetch all the notes
router.get("/fetchnotes", Fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Adding the new notes
router.post(
  "/addnotes",
  Fetchuser,
  [
    body("title", "Enter a valid length for the title").isLength({ min: 3 }),
    body("description", "Enter a valid length for the description").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { title, description, tag } = req.body;
    // Erros to find
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Adding new Notes
      const notes = await Notes.create({
        title,
        description,
        tag,
        user: req.user.id,
      });
      res.json(notes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
