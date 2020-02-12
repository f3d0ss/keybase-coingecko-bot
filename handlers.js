const CoinGecko = require('coingecko-api')

const CoinGeckoClient = new CoinGecko()

let allCoins

async function getIds(name) {
    let lowerName = name.toLowerCase()
    console.log("lowerName: " + lowerName)
    if (allCoins === undefined || allCoins.code != 200) {
        allCoins = await CoinGeckoClient.coins.list()
    }
    if (allCoins.code != 200) {
        throw 'Get Ids:\t server error'
    }

    return allCoins.data.filter(coin => coin.id == lowerName || coin.symbol == lowerName || coin.name == lowerName).map(coin => coin.id)

}


async function createPriceMessage(coinId) {
    const response = await CoinGeckoClient.coins.fetch(coinId, {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: false
    })
    if (!response.success)
        throw 'fetch error'
    const coin = response.data
    const message = "*" + coin.name + " | " + coin.symbol + "*\n\n" +
        "EUR\t: €" + coin.market_data.current_price.eur + "\n" +
        "USD\t: $" + coin.market_data.current_price.usd + "\n" +
        "BTC\t: ฿" + coin.market_data.current_price.btc + "\n" +
        "ETH\t: ♢" + coin.market_data.current_price.eth + "\n\n" +
        "Mkt Cap\t: €" + coin.market_data.market_cap.eur + "\n" +
        "Volume\t: €" + coin.market_data.market_cap.eur + "\n" +
        "24hr %\t: " + coin.market_data.price_change_percentage_24h + "%\n" +
        "7d %\t: " + coin.market_data.price_change_percentage_7d + "%\n" +
        "30d %\t: " + coin.market_data.price_change_percentage_30d + "%\n" +
        "1y %\t: " + coin.market_data.price_change_percentage_1y + "%\n\n"
    return message
}

async function createVolumeMessage(coinId) {
    const response = await CoinGeckoClient.coins.fetch(coinId, {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: false
    })
    if (!response.success)
        throw 'fetch error'
    const coin = response.data
    const message = "*" + coin.name + " | " + coin.symbol + "*\n\n" +
        "Volume\t: €" + coin.market_data.market_cap.eur + "\n"
    return message
}


async function generatePriceMessages(coins) {
    let messages = [];
    for (const coin of coins) {
        const ids = await getIds(coin)
        if (ids === undefined || ids.length == 0) {
            messages.push(Promise.resolve("No coins found with: " + coin))
        }
        for (const id of ids) {
            messages.push(createPriceMessage(id))
        }
    }
    return messages
}

async function generateVolumeMessages(coins) {
    let messages = [];
    for (const coin of coins) {
        const ids = await getIds(coin)
        if (ids === undefined || ids.length == 0) {
            messages.push(Promise.resolve("No coins found with: " + coin))
        }
        for (const id of ids) {
            messages.push(createVolumeMessage(id))
        }
    }
    return messages
}

function generateStartMessage() {
    const message = "Hi! I'm GeckoBot! You can ask me crypto questions like: \n\n" +
        "*Commands*\n" +
        "Price\t       - `!cg p <symbol>`"
    return message
}


module.exports.generatePriceMessages = generatePriceMessages
module.exports.generateVolumeMessages = generateVolumeMessages
module.exports.generateStartMessage = generateStartMessage