// Import necessary modules
import mongoose from 'mongoose';
import cors from 'cors';
import app from './app.js'; 
import 'dotenv/config';  // No need to specify the file extension for dotenv

// Enable CORS
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mart-management')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
