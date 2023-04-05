const api = require('../api/index.js');
const fetcher = require('./fetcher.js');
const db = require('../models/index.js');

module.exports = class Finder {
    constructor(args = []) {
        const { hooks } = args;
        this._botHooks = hooks;
        this._api = api;
        this._db = db;
        this._intervals = {};
        this._rates = {};
        this._scanTimeout = 10 * 1000;
        this._resumeFetch = true;
        this._fetcher = fetcher;

        this._methods = {
            RUB: ["Renaissance Credit Bank", "Home Credit Bank (Russia)", "Bank Saint-Petersburg", "Payeer", "MTS-Bank", "OTP", "Uralsib Bank", "Credit Europe Bank (Russia)", "Tinkoff", "Post Bank", "Mobile top-up", "RosBank", "Bank Transfer", "Ak Bars Bank", "BCS Bank", "Юmoney", "Advcash", "Citibank (Russia)", "Russian Standard Bank", "Raiffeisenbank", "QIWI", "UniCredit", "A-Bank", "BinancePay (RUB)"],
            UZS: ["Anorbank", "Humo", "Bank Transfer", "Kapitalbank", "PayMe", "QIWI", "TBC Bank", "Uzcard"],
            KZT: ["Home Credit Kazakhstan", "Nurbank", "Bank RBK", "Eurasian Bank", "Bank Transfer", "CenterCredit Bank", "Jysan Bank", "Kaspi Bank", "ForteBank", "Altyn Bank", "Halyk Bank"]
        }
        this._assets = ["USDT", "BTC", "ETH", "BNB", "BUSD", "DAI"];

        this._setP2PScanner();
        this._setRateScanner();
    }

    get scanTimeout() {
        return this._scanTimeout;
    }
    set scanTimeout(val) {
        this._scanTimeout = val;
    }

    get resumeFetch() {
        return this._resumeFetch;
    }
    set resumeFetch(val) {
        this._resumeFetch = val;
    }

    
    async _setP2PScanner() {
        const _this = this;
        this._intervals._setP2PScanner = setInterval(async () => {
            try {

                if (_this._resumeFetch) {
                    // await _this._fetcher.fetch({ hooks: _this });
                    _this._routeFinder();
                }

            } catch (error) {
                const err = new Error(error);
                console.log(err, 'err');
            }
        }, _this._scanTimeout);
    }
    async _setRateScanner() {
        const _this = this;
        this._intervals._setRateScanner = setInterval(async () => {
            try {

                await _this._fetcher.fetchRates({ hooks: _this });

            } catch (error) {
                const err = new Error(error);
                console.log(err, 'err');
            }
        }, _this._scanTimeout);
    }

    _routeFinder(args = []) {
        // const { result } = args;
        const fs = require('fs');
        const result = JSON.parse(fs.readFileSync('./result.json'));
        const spreads = [];
        const scores = {}

        Object.keys(result).forEach((fiat) => {
            scores[fiat] = {};
            Object.keys(result[fiat].BUY).forEach((asset) => {
                scores[fiat][asset] = result[fiat].BUY[asset].map((adv) => {

                    if (this._rates && this._rates[asset]) {
                        return Object.keys(this._rates[asset]).map((key) => {
                            const val = this._rates[asset][key];
                            return [key, +val * +adv.adv.price]
                        })
                    }
                    
                })
            })
        })

        console.log(JSON.stringify(scores), 'scores')

        // await _this._saveRoutes(routes);
    }

    _rateCalc (args = []) {
        const { result } = args;

        Object.keys(result).forEach((pair) => {
            const per = this._assets.includes(pair.slice(-3))
                ? pair.slice(-3)
                : (
                    this._assets.includes(pair.slice(-4))
                    ? pair.slice(-4)
                    : undefined
                )

            if (per) {
                const asset = pair.replace(per, '');
                !this._rates[asset]
                    ? this._rates[asset] = {}
                    : '';
                this._rates[asset][per] = result[pair]
            }
        })
    }


    async _saveRoutes(routes) {
        if (routes && routes.length > 0) {
            await this._db["Route"].create(routes)
        }
    }

    _stopScanner() {
        Object.keys(this._intervals).forEach((interval) => {
            clearInterval(this._intervals[interval]);
        })
    }

}