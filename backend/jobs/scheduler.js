const cron = require('node-cron');
const abuseIpdbService = require('../services/abuseIpdbService');
const dataProcessor = require('../services/dataProcessor');

const start = () => {
    console.log('Starting background jobs...');

    // Refresh data every 60 seconds
    cron.schedule('*/60 * * * * *', async () => {
        console.log('Running scheduled data refresh...');
        try {
            // Simulate real-time monitoring by fetching recent blacklist entries
            // We limit to 5 to avoid rate limits and keep it "simulated" but active
            const blacklist = await abuseIpdbService.getBlacklist(5);

            if (blacklist && blacklist.data) {
                for (const item of blacklist.data) {
                    await dataProcessor.processAndSaveIp(item.ipAddress);
                }
            }
        } catch (error) {
            console.error('Error in scheduled data refresh:', error.message);
        }
    });
};

module.exports = { start };
