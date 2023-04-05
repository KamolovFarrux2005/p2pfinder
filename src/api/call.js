const axios = require('axios');
const api = axios.create({ baseURL: 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c' })

module.exports = {
    getAdvs: async (args = []) => {
        const { params } = args;

        try {
            const res = await api.post('/adv/search', {
                ...params
            });
            if (res.data.success) {
                return res.data.data;
            } else {
                const err = new Error(res.data.message);
                throw err;
            }
        } catch (error) {
            const err = new Error(error);
            throw err;
        }
    }
};