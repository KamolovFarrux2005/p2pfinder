const { LinearClient , WebsocketClient, DefaultLogger } = require('bybit-api');

DefaultLogger.silly = () => {};

const main = new LinearClient(

    // optional, uses testnet by default. Set to 'true' to use livenet.
    true,

    // restClientOptions,
    // requestLibraryOptions
);

const test = new LinearClient(

    // optional, uses testnet by default. Set to 'true' to use livenet.
    false,

    // restClientOptions,
    // requestLibraryOptions
);


const wsConfig = {

    /*
      The following parameters are optional:
    */

    // defaults to false == testnet. Set to true for livenet.
    livenet: false,

    // NOTE: to listen to multiple markets (spot vs inverse vs linear vs linearfutures) at once, make one WebsocketClient instance per market

    // defaults to inverse:
    // market: 'inverse'
    market: 'linear',
    // market: 'spot'

    // how long to wait (in ms) before deciding the connection should be terminated & reconnected
    // pongTimeout: 1000,

    // how often to check (in ms) that WS connection is still alive
    // pingInterval: 10000,

    // how long to wait before attempting to reconnect (in ms) after connection is closed
    reconnectTimeout: 500,

    // config options sent to RestClient (used for time sync). See RestClient docs.
    // restOptions: { },

    // config for axios used for HTTP requests. E.g for proxy support
    // requestOptions: { }

    // override which URL to use for websocket connections
    // wsUrl: 'wss://stream.bytick.com/realtime'

    DefaultLogger,
};

const testWs = new WebsocketClient(wsConfig);
wsConfig.livenet = true;
const mainWs = new WebsocketClient(wsConfig);

module.exports = {
    main,
    test,
    mainWs,
    testWs
};