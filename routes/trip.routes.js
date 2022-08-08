const router = require("express").Router();
const bcrypt = require("bcrypt");
const TripModel = require("../models/trip.model");

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin");

// CREATE TRIP
router.post(
  "/add-trip",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const createdTrip = await TripModel.create({
        ...req.body,
      });

      return res.status(201).json(createdTrip);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

// READ ALL TRIPS
router.get(
  "/all-trips",

  async (req, res) => {
    try {
      const allTrips = await TripModel.find();
      return res.status(200).json(allTrips);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

// READ ONE TRIP
router.get("/one-trip/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const oneTrip = await TripModel.findOne({ _id: id });
    return res.status(200).json(oneTrip);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// UPDATE ONE TRIP
router.patch(
  "/edit-trip/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const editTrip = await TripModel.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      );
      return res.status(200).json(editTrip);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

// DELETE ONE TRIP
router.delete(
  "/delete-trip/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTrip = await TripModel.deleteOne({ _id: id });
      return res.status(200).json(deleteTrip);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
