const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db'); 
const userRoutes = require('./routes/userRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Tote Bag E-Commerce Backend is Running!');
});

sequelize.sync()
    .then(() => console.log('Database & tables synced successfully!'))
    .catch(err => console.error('Database sync error:', err));

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
