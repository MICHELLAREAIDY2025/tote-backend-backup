// Import Sequelize and DataTypes from sequelize package
const { DataTypes } = require('sequelize');

// Import the Sequelize instance from the db.js file
const sequelize = require('../config/db');

// Define the Product model
const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT, // CORRECTION: Changed to TEXT for longer descriptions
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, { 
    timestamps: true,  // CORRECTION: Enable timestamps for tracking
    tableName: 'products' // CORRECTION: Explicitly set table name
});


// Export the Product model
module.exports = Product;