const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateFormData } = require("../utils/validator");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the form
    validateFormData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // encrypt of the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.send("saved succesfully");
  } catch (error) {
    res.status(400).send({ message: "Error", error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }

    console.log("Password from request:", password);
    console.log("Password from database:", user.password);

    const isPasswordValid = await user.validatePassword(password);
    // bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a JWT token

      const token = await user.getJWT();
      // Add the token to the cookie and send the response back to the user
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(400).send({ message: "Error", error: error.message });
  }
});

authRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("LOGOUT SUCCESSFULL");
});

module.exports = authRouter;
