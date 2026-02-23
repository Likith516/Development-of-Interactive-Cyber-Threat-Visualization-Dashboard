const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Threat = sequelize.define('Threat', {
        ip: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        abuseScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        riskLevel: {
            type: DataTypes.STRING, // Safe, Suspicious, Malicious
            defaultValue: 'Safe'
        },
        countryCode: {
            type: DataTypes.STRING
        },
        isp: {
            type: DataTypes.STRING
        },
        usageType: {
            type: DataTypes.STRING
        },
        domain: {
            type: DataTypes.STRING
        },
        hostnames: {
            type: DataTypes.TEXT // JSON stringified array of hostnames
        },
        totalReports: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lastReportedAt: {
            type: DataTypes.DATE
        }
    });

    return Threat;
};
