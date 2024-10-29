const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateFormData } = require("./utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");


app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});

app.post("/login", async (req, res) => {
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
      res.send("login successful");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(400).send({ message: "Error", error: error.message });
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const userId = await User.find({ emailId: userEmail });
    if (userId.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(userId);
    }
  } catch (error) {
    res.status(400).send("Error", error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("Error", error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user data deleted succesfully");
  } catch (error) {
    res.status(400).send("Error", error.message);
  }
});

// TO UPDATE THE USER
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = ["firstName", "lastName", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATE.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    if (data.skills.length > 10) {
      throw new Error("cannot add more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("updated successfully");
  } catch (error) {
    res.status(400).send({ message: "Error", error: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connect succcesfully");
    app.listen(3000, () => {
      console.log("Server is istening succesfully on 3000 port");
    });
  })
  .catch((error) => {
    console.error("not connected", error.message);
  });
