const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const API_KEY = process.env.ABUSEIPDB_API_KEY;
const BASE_URL = 'https://api.abuseipdb.com/api/v2';

const checkIp = async (ip) => {
    try {
        const response = await axios.get(`${BASE_URL}/check`, {
            params: {
                ipAddress: ip,
                maxAgeInDays: 90,
                verbose: true
            },
            headers: {
                'Key': API_KEY,
                'Accept': 'application/json'
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error checking IP with AbuseIPDB:', error.message);
        return null;
    }
};

const getBlacklist = async (limit = 100) => {
    try {
        const response = await axios.get(`${BASE_URL}/blacklist`, {
            params: {
                limit: limit
            },
            headers: {
                'Key': API_KEY,
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching blacklist from AbuseIPDB:', error.message);
        return [];
    }
};

module.exports = { checkIp, getBlacklist };
