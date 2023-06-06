const sequelize = require("../utils/connection");
const User = require("../models/User");
require("../models/Category");
require("../models/Product");
require("../models");

const main = async () => {
  try {
    await sequelize.sync({ force: true });

    await User.create({
      firstName: "test Sammy",
      lastName: "test Rosa",
      email: "testsammy@gmail.com",
      password: "sammy1234",
      phone: "8097787744",
    });

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
