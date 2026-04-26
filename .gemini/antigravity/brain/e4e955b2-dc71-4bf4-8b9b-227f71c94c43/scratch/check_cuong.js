import mongoose from 'mongoose';
import User from './server/models/user.model.js';
import Checkin from './server/models/checkin.model.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = "mongodb://localhost:27017/fitness-ai";

async function checkUser() {
    await mongoose.connect(mongoUri);
    const user = await User.findOne({ email: 'cuong@gmail.com' });
    if (user) {
        const checkins = await Checkin.find({ userId: user._id });
        console.log('User Stats:', user.stats);
        console.log('User Skills:', user.skills);
        console.log('Checkins:', checkins);
    } else {
        console.log('User cuong@gmail.com not found');
    }
    await mongoose.disconnect();
}

checkUser();
