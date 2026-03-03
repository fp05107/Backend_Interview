import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        return true
    } catch (error) {
        return false
    }
}


const disConnectDB = async () => {
    try {
        await mongoose.disconnect();
        return true;
    } catch (error) {
        return false
    }
}

mongoose.connection.on('connected', () => {

})

mongoose.connection.on('error', () => {

})

mongoose.connection.on('disconnected', () => {

})

// SIGINT -> Signal Interrupt
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0) // Terminates the process with exit code 0, 0 means successful/clean exit
})