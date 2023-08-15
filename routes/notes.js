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

// Updating the notes
router.put("/updatenotes/:id", Fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //   Create a new note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //   Find the note and update it
    // console.log(await Notes.findById(req.params.id));
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).json("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      res.status(401).json("Unauthorized access");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    // console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Deleting the notes
router.delete("/deletenotes/:id", Fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).json("Not Found");
    } else {
      if (note.user.toString() !== req.user.id) {
        res.status(401).json("Unauthorized access");
      }
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({ Success: "Note has been deleted", note: note });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
