require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const Threat = require('./models/Threat')(sequelize);
const IOC = require('./models/IOC')(sequelize);

// Sync Database
sequelize.sync()
    .then(() => console.log('Database & Tables created!'))
    .catch(err => console.error('Error creating database:', err));

// Routes
app.use('/api', require('./routes/api'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Cyber Threat Intelligence API is running');
});

// Start Scheduler
require('./jobs/scheduler').start();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, sequelize };
