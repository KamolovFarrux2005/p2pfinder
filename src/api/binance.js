const BinanceApi = require("node-binance-api");
const binanceApi = new BinanceApi();
const main = binanceApi.options({
    reconnect: true,
    test: false
})

const test = binanceApi.options({
    reconnect: true,
    test: true
})


module.exports = {
    main,
    test
};
