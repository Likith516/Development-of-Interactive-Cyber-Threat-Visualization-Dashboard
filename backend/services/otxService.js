const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const API_KEY = process.env.OTX_API_KEY;
const BASE_URL = 'https://otx.alienvault.com/api/v1';

const getIpPulses = async (ip) => {
    try {
        const response = await axios.get(`${BASE_URL}/indicators/IPv4/${ip}/general`, {
            headers: {
                'X-OTX-API-KEY': API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching OTX pulses for IP:', error.message);
        return null; // Return null on error so the caller knows it failed
    }
};

// Function to search for pulses - useful for gathering general threat data
const searchPulses = async (query, limit = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/pulses`, {
            params: {
                q: query,
                limit: limit
            },
            headers: {
                'X-OTX-API-KEY': API_KEY
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error searching OTX pulses:', error.message);
        return [];
    }
}

module.exports = { getIpPulses, searchPulses };
