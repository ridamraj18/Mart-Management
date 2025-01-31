import express from 'express';
import mongoose from 'mongoose'; // Default import for mongoose
import bodyParser from 'body-parser'; // Import body-parser as default
import cors from 'cors';
import productRoutes from './routes/Products.js'; // Corrected path

const app = express();
const PORT = 3000;


  
 // useNewUrlParser: true,
  //useUnifiedTopology: true,

//mongoose.connection.once('open', () => {
  //console.log('Connected to MongoDB');


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/products', productRoutes);

export default app;
