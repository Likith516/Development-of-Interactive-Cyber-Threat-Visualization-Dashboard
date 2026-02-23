const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const TOKEN = process.env.IPINFO_TOKEN;
const BASE_URL = 'https://ipinfo.io';

const getIpDetails = async (ip) => {
    try {
        const response = await axios.get(`${BASE_URL}/${ip}`, {
            params: {
                token: TOKEN
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching IP details from IPinfo:', error.message);
        return null;
    }
};

module.exports = { getIpDetails };
