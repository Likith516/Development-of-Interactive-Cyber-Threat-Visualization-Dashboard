const { Sequelize } = require('sequelize');
const path = require('path');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../database.sqlite'),
    logging: false
});

const Threat = require('../models/Threat')(sequelize);
const IOC = require('../models/IOC')(sequelize);

const abuseIpdbService = require('./abuseIpdbService');
const otxService = require('./otxService');
const ipinfoService = require('./ipinfoService');

const processAndSaveIp = async (ip) => {
    console.log(`Processing IP: ${ip}`);

    // Fetch data in parallel
    const [abuseData, otxData, ipData] = await Promise.all([
        abuseIpdbService.checkIp(ip),
        otxService.getIpPulses(ip),
        ipinfoService.getIpDetails(ip)
    ]);

    if (!abuseData && !otxData && !ipData) {
        console.error(`Failed to fetch data for IP: ${ip}`);
        return null;
    }

    // specific handling for AbuseIPDB error or missing data
    const abuseScore = abuseData ? abuseData.abuseConfidenceScore : 0;

    // Determine Risk Level
    let riskLevel = 'Safe';
    if (abuseScore > 50) riskLevel = 'Malicious';
    else if (abuseScore > 10) riskLevel = 'Suspicious';

    // Aggregate Data
    const threatData = {
        ip: ip,
        abuseScore: abuseScore,
        riskLevel: riskLevel,
        countryCode: ipData ? ipData.country : (abuseData ? abuseData.countryCode : null),
        isp: ipData ? ipData.org : (abuseData ? abuseData.isp : null),
        usageType: abuseData ? abuseData.usageType : null,
        domain: abuseData ? abuseData.domain : (ipData ? ipData.hostname : null),
        hostnames: abuseData && abuseData.hostnames ? JSON.stringify(abuseData.hostnames) : null,
        totalReports: abuseData ? abuseData.totalReports : 0,
        lastReportedAt: abuseData ? abuseData.lastReportedAt : new Date()
    };

    // Upsert Threat
    await Threat.upsert(threatData);

    // Process OTX Pulses for IOCs
    if (otxData && otxData.pulse_info && otxData.pulse_info.pulses) {
        for (const pulse of otxData.pulse_info.pulses) {
            await IOC.create({
                type: 'pulse',
                indicator: pulse.name,
                source: 'AlienVault OTX',
                confidence: 0, // OTX doesn't always provide a direct confidence score in this view
                lastSeen: pulse.created,
                threatCategory: 'General'
            }).catch(err => {
                // Ignore unique constraint errors or just log them
                // console.log('Duplicate IOC or error'); 
            });
        }
    }

    // Process AbuseIPDB Reports if any (AbuseIPDB check endpoint gives summary, not individual reports usually, but we can treat the IP itself as an IOC if malicious)
    if (riskLevel === 'Malicious') {
        await IOC.create({
            type: 'ip',
            indicator: ip,
            source: 'AbuseIPDB',
            confidence: abuseScore,
            lastSeen: new Date(),
            threatCategory: 'Malicious IP'
        }).catch(err => { });
    }

    return await Threat.findByPk(ip);
};

// Function to fetch a batch of high-risk IPs to populate DB
const seedDatabase = async () => {
    // Example: fetch blacklist from AbuseIPDB (or just use a hardcoded list for now if the endpoint is restricted)
    // Note: The blacklist endpoint might require a higher tier key. 
    // We'll try to use the check-ip flow with some known bad IPs or just wait for user input.
    // However, to make the dashboard look alive, we might want to fetch some recent reports.
    console.log("Seeding logic placeholder - waiting for user interactions");
}

module.exports = { processAndSaveIp, seedDatabase };
