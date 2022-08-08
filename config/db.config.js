const mongoose = require("mongoose");

async function connect() {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connect to DB:", dbConnection.connections[0].name);
  } catch (error) {
    console.log("Connection error", error);
  }
}

module.exports = connect;
