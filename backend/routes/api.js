const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');
const path = require('path');

// Re-initialize Sequelize here or pass it in. Ideally pass it in, but for quick setup:
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../database.sqlite'),
    logging: false
});

const Threat = require('../models/Threat')(sequelize);
const IOC = require('../models/IOC')(sequelize);
const dataProcessor = require('../services/dataProcessor');

// GET /api/threats - Get all threats (paginated)
router.get('/threats', async (req, res) => {
    try {
        const threats = await Threat.findAll({ limit: 100, order: [['lastReportedAt', 'DESC']] });
        res.json(threats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/threats/ip/:ip - Get specific IP details
router.get('/threats/ip/:ip', async (req, res) => {
    try {
        const threat = await Threat.findByPk(req.params.ip);
        if (threat) {
            res.json(threat);
        } else {
            res.status(404).json({ message: 'IP not found in database' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/threats/statistics - Aggregate stats
router.get('/threats/statistics', async (req, res) => {
    try {
        const totalIPs = await Threat.count();
        const maliciousIPs = await Threat.count({ where: { riskLevel: 'Malicious' } });
        const suspiciousIPs = await Threat.count({ where: { riskLevel: 'Suspicious' } });
        const safeIPs = await Threat.count({ where: { riskLevel: 'Safe' } });
        const topCountry = await Threat.findOne({
            attributes: ['countryCode', [sequelize.fn('COUNT', sequelize.col('countryCode')), 'count']],
            group: ['countryCode'],
            order: [[sequelize.col('count'), 'DESC']]
        });

        res.json({
            totalIPs,
            maliciousIPs,
            suspiciousIPs,
            safeIPs,
            topCountry: topCountry ? topCountry.countryCode : 'N/A'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/threats/trends - Mock trends for now or aggregate by date
router.get('/threats/trends', async (req, res) => {
    // Simplified trend data for charts
    try {
        // Group by hour or day would be better, but sticking to simple count for now
        // This is a placeholder for the trend chart
        const trends = await Threat.findAll({
            attributes: ['lastReportedAt', 'abuseScore'],
            limit: 50,
            order: [['lastReportedAt', 'ASC']]
        });
        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/iocs - Get IOCs
router.get('/iocs', async (req, res) => {
    try {
        const iocs = await IOC.findAll({ limit: 50, order: [['lastSeen', 'DESC']] });
        res.json(iocs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/check-ip - check an IP
router.post('/check-ip', async (req, res) => {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: 'IP address is required' });

    try {
        const result = await dataProcessor.processAndSaveIp(ip);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
