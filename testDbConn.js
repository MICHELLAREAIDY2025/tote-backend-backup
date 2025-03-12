const sequelize = require('./config/db');

sequelize.sync()
    .then(() => console.log('Database synced successfully!'))
    .catch(err => console.error('Database sync error:', err));
