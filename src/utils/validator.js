const validator = require("validator");

const validateFormData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password not strong");
  }
};

module.exports = {
  validateFormData,
};
