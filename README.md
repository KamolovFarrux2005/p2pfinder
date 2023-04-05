
# P2P Route Finder

We have two parts to develop, Server and Client.

## Server

- Get data from exchanges (binance and bybit)
- Finding best routes to have maximum spread
    - analyzing Advertiser's data
        - inputs to get results (has defaults)
            ````
            exchange: binance,
            amount: 10000,
            fiat: UZS,
            assets: [BNB, BTC, BUSD, DAI, ETH, USDT]
            payments: [perfect money, Skrill (Moneybookers), Wise]
            ````
        - categorize data
        - search for best buy and sell with with considering fees
        - save best finded routes
    - will be updated every 10 seconds
- Buying and Selling prices for each above assets
- Custom filters (after phase 1)
- User management and Subscription (after phase 1)
- Charts and Visualizations (if the team wants this feature)

## Client (Telegram Bot)

- Commands
    - `/get_best_routes` (gives top 20 routes for now)
    - `/set_amount` (amount you want to buy)
    - `/set_fiat`
    - `/set_exchange`
- Notifications
    - user can give some default notifications
    - `/set_custom_notification` (after phase 1)
- Set custom default advanced filters (after phase 1)
- Complete user and subscription management (after phase 1)
- Private and Public channel integration (after phase 1)
