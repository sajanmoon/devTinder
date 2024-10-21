const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sajanmoon5:dyDxjk03h200lHVF@devtinderapp.qqjcu.mongodb.net/?retryWrites=true&w=majority&appName=DevTinderApp"
  );
};

connectDB()
  .then(() => {
    console.log("Database connect succcesfully");
  })
  .catch((error) => {
    console.error("not connected", error.message);
  });
