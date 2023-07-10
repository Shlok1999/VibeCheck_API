const express = require('express');
// Initiate all the npm packages form package.json
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());


const port = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database
const db = require('./db/conn');

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
