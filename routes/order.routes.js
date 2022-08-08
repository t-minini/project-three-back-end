const router = require("express").Router();
const bcrypt = require("bcrypt");
const TripModel = require("../models/trip.model");
const OrderModel = require("../models/order.model");
const UserModel = require("../models/user.model");

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin");

// CREATE ORDER
router.post("/new-order", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const newOrder = await OrderModel.create({
      ...req.body,
      //    orderTotal: total,
      customerId: loggedInUser._id,
    });
    await UserModel.findByIdAndUpdate(loggedInUser._id, {
      $push: {
        orders: newOrder._id,
      },
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// READ ALL ORDERS (Admin)
router.get(
  "/all-orders",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const allOrders = await OrderModel.find()
        .populate("customerId")
        .populate("trips");
      console.log(allOrders);
      return res.status(200).json(allOrders);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

//Read orders by User
router.get("/all-orders-user", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    const allOrders = await OrderModel.find({ customerId: loggedInUser._id });
    return res.status(200).json(allOrders);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// READ ONE ORDER
router.get("/one-order/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const oneOrder = await OrderModel.findOne({ _id: id });
    return res.status(200).json(oneOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// UPDATE ONE ORDER
router.patch("/edit-order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const editOrder = await OrderModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    return res.status(200).json(editOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// DELETE ONE ORDER
router.delete("/delete-order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOrder = await OrderModel.deleteOne({ _id: id });
    return res.status(200).json(deleteOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
