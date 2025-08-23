const mongoose = require("mongoose");
require('dotenv').config();

const dbConnect = async () => {
  try {
    const connectionString = process.env.MONGO_URI;

    // Check if the MONGO_URI environment variable is defined
    if (!connectionString) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    

    // Attempt to connect to MongoDB
    await mongoose.connect(connectionString);
    console.log("Database connection is successful");
  } catch (err) {
    console.error("Database connection error:", err.message);
    // Optionally, you can log the full error object for more details
    console.error("Full error object:", err);
    // If the connection fails, you can choose to exit the process if necessary
    process.exit(1);
  }
};

module.exports = dbConnect;