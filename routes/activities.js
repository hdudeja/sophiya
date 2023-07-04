// routes/activities.js

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Activity = require('../models/Activity');

// Get all activities for the authenticated user
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const activities = await Activity.find({ user: req.user._id });
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

// Create a new activity
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      const newActivity = new Activity({
        title,
        description,
        user: req.user._id,
      });

      await newActivity.save();
      res.json(newActivity);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

// Update an activity
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { title, description, completed } = req.body;

      const activity = await Activity.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
          $set: {
            title,
            description,
            completed,
          },
        },
        { new: true }
      );

      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }

      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

// Delete an activity
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const activity = await Activity.findOneAndRemove({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }

      res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
);

module.exports = router;
