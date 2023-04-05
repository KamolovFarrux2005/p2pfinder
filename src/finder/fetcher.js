module.exports.fetchRoutes = async (args = []) => {
    const { hooks } = args;

    const result = {};

    hooks.resumeFetch = false;

    for await (const fiat of Object.keys(hooks._methods)) {

        result[fiat] = { SELL: {}, BUY: {} };

        for await (const tradeType of Object.keys(result[fiat])) {

            for await (const asset of hooks._assets) {

                try {

                    result[fiat][tradeType][asset] = await hooks._api.call.getAdvs({
                        params: {
                            proMerchantAds: false,
                            page: 1,
                            rows: 10,
                            payTypes: [],
                            countries: [],
                            publisherType: null,
                            fiat,
                            tradeType,
                            asset,
                            merchantCheck: false
                        }
                    });

                    const finished = Object.keys(result).length *
                        Object.keys(result[fiat]).length *
                        Object.keys(result[fiat][tradeType]).length ==
                        Object.keys(hooks._methods).length *
                        hooks._assets.length * 2;

                    if (finished) {
                        hooks._routeFinder({ result });
                        hooks.resumeFetch = true;
                    }

                } catch (error) {
                    const err = new Error(error);
                    console.log(err);
                }


            }

        }

    }
}

module.exports.fetchRates = async (args = []) => {
    const { hooks } = args;

    try {

        const result = await hooks._api.binance.main.prices();
        hooks._rateCalc({ result });

    } catch (error) {
        const err = new Error(error);
        console.log(err);
    }

}