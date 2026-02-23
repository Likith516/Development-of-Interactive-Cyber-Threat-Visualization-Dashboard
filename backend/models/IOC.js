const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const IOC = sequelize.define('IOC', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING, // ip, domain, url, hash
            allowNull: false
        },
        indicator: {
            type: DataTypes.STRING,
            allowNull: false
        },
        source: {
            type: DataTypes.STRING // AbuseIPDB, OTX, etc.
        },
        confidence: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lastSeen: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        threatCategory: {
            type: DataTypes.STRING
        }
    });

    return IOC;
};
