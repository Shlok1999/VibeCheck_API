const express = require('express');
// Initiate all the npm packages form package.json
const cors = require('cors');
const app = express();
require('dotenv').config();
const bp = require('body-parser');

app.use(cors());

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


const port = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('uploads'));
// Database
const db = require('./db/conn');

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
