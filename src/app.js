const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());
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

// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.find({ emailId: userEmail });
//     res.send(user);
//   } catch (error) {
//     res.status(400).send("Not found", error.message);
//   }
// });

// });

app.post("/signup", async (req, res) => {
  console.log(req.body);
  // res.status(200).send(body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("saved succesfully");
  } catch (error) {
    res.status(400).send("Error", error.message);
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
