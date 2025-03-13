import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log("Attempting to connect to database.....");
    await mongoose.connect("mongodb+srv://pm921670:tGavFyJf391fTXqk@tasku.5m98f.mongodb.net/?retryWrites=true&w=majority&appName=tasku", {});
    console.log("Connected to database.....");
  } catch (error) {
    console.log("Failed to connect to database.....", error.message);
    process.exit(1);
  }
};

export default connect;
