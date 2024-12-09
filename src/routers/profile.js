const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validator");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});

// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
//   try {
//     if (!validateEditProfileData(req)) {
//       throw new Error("Invalid edit Request");
//     }
//     const loggedInUser = req.user;
//     Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

//     await loggedInUser.save();

//     res.json({
//       message: `${loggedInUser.firstName},your profile saved successfully`,
//       data: loggedInUser,
//     });
//   } catch (error) {
//     res.send(400).send("ERROR:" + error.message);
//   }
// });

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request. Please check your data.");
    }

    const loggedInUser = req.user;
    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "about",
      "gender",
      "photoUrl",
    ]; // Example fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully.`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = profileRouter;
