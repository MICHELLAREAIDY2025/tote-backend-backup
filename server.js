const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const sequelize = require('./config/db'); 
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); 
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Backend is Running!');
});

// CORRECTION: Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
 
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // CORRECTION: Sync models with { alter: true } for safer updates
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized.');
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(` Server running on port ${PORT}!`));
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

startServer();
