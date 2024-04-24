const mongoose = require("mongoose");
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connected to the database");
    // Further operations with the database can be placed here
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }  
}
 
// Call the function to connect to the database
connectToDatabase();
