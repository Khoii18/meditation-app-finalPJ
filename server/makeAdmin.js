import 'dotenv/config';
import mongoose from "mongoose";
import User from "./models/user.model.js";

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const email = 'Khoi@gmail.com';
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.findOne({});
    }

    if (user) {
      user.role = "admin";
      await user.save();
      console.log(`Success! Elevated ${user.email} to Admin.`);
    } else {
      console.log("No user found in the database. Please register a user first on the UI.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

makeAdmin();
