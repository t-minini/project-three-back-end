const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
require("dotenv").config();

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin");

const saltRounds = 10;

// SIGN UP
router.post("/sign-up", async (req, res) => {
  try {
    // Primeira coisa: Criptografar a senha!-
    const { password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    if (password === process.env.TOKEN_SIGN_SECRET) {
      await UserModel.create({
        ...req.body,
        role: "ADMIN",
        passwordHash: passwordHash,
      });

      return res.status(201).json({ message: "Welcome Admin" });
    }

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: passwordHash,
    });

    delete createdUser._doc.passwordHash;

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// LOG-IN
router.post("/log-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Wrong password or email. Please, try again!" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      const token = generateToken(user);

      return res.status(200).json({
        token: token,
        user: { ...user._doc },
      });
    } else {
      return res
        .status(400)
        .json({ msg: "Wrong password or email. Please, try again!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// READ ALL USERS
router.get("/all-users", async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// READ ONE USER BY TOKEN
router.get("/profile", isAuth, attachCurrentUser, (req, res) => {
  return res.status(200).json(req.currentUser);
});

// UPDATE USER BY TOKEN
router.patch("/update-user", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { ...req.body },
      { new: true }
    );

    delete updatedUser._doc.passwordHash;

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//SOFT DELETE BY USER
router.delete("/disable-user", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const disabledUser = await UserModel.findOneAndUpdate(
      { _id: req.currentUser._id },
      { isActive: false, disabledOn: Date.now() },
      { runValidators: true, new: true }
    );

    delete disabledUser._doc.passwordHash;
    return res.status(200).json(disabledUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// DELETE BY ADMIN
router.delete(
  "/delete-user/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleteUser = await UserModel.deleteOne({ _id: id });
      return res.status(200).json(deleteUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
