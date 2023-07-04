// routes/reminders.js

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Reminder = require('../models/Reminder');

// Get all reminders for the authenticated user
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reminders = await Reminder.find({ user: req.user._id });
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

// Create a new reminder
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { title, description, dueDate, priority } = req.body;

      const newReminder = new Reminder({
        title,
        description,
        dueDate,
        priority,
        user: req.user._id,
      });

      await newReminder.save();
      res.json(newReminder);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

// Update a reminder
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { title, description, dueDate, priority } = req.body;

      const reminder = await Reminder.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
          $set: {
            title,
            description,
            dueDate,
            priority,
          },
        },
        { new: true }
      );

      if (!reminder) {
        return res.status(404).json({ message: 'Reminder not found' });
      }

      res.json(reminder);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

// Delete a reminder
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reminder = await Reminder.findOneAndRemove({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!reminder) {
        return res.status(404).json({ message: 'Reminder not found' });
      }

      res.json({ message: 'Reminder deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

module.exports = router;
