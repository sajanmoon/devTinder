const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/devtinder");
};

module.exports = connectDB;

// mongodb+srv://sajanmoon5:<db_password>@devtinderapp.qqjcu.mongodb.net/?retryWrites=true&w=majority&appName=DevTinderApp
