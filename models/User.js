// Import Sequelize and DataTypes from sequelize package

const { Sequelize, DataTypes } = require('sequelize');

// Import the Sequelize instance configured in the db.js file

const sequelize = require('../config/db');

// Define the User model with its schema

const User = sequelize.define('Users', {
  // Define the 'id' field as an auto-incremented primary key

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
     // Define the 'role' field with ENUM values

    role: {
        type: DataTypes.ENUM('customer', 'admin'),
        defaultValue: 'customer'
    },
    address: {
        type: DataTypes.JSON,  // Stores address in JSON format
        allowNull: true,  // Address is optional
        defaultValue: null// Default value is null
    }
}, { 
     // Disable automatic creation of 'createdAt' and 'updatedAt' timestamps

    timestamps: false 
});
// Export the User model for use in other parts of the application

module.exports = User;
