const CoinGecko = require("coingecko-api")

const CoinGeckoClient = new CoinGecko()

const BOT_PREFIX = "coingecko"
const PRICE_COMMAND = "price"
const START_COMMAND = "start"
const VOLUME_COMMAND = "volume"
const MARKETCAP_COMMAND = "marketcap"
const DEV_COMMAND = "dev"
const ROI_COMMAND = "roi"
const SOCIAL_COMMAND = "social"
const DESCRIPTION_COMMAND = "description"

let allCoins

async function getIds(name) {
  let lowerName = name.toLowerCase()
  console.log("lowerName: " + lowerName)
  if (allCoins === undefined || allCoins.code != 200) {
    allCoins = await CoinGeckoClient.coins.list()
  }
  if (allCoins.code != 200) {
    throw "Get Ids:\t server error"
  }

  return allCoins.data
    .filter(
      coin =>
        coin.id == lowerName ||
        coin.symbol == lowerName ||
        coin.name == lowerName
    )
    .map(coin => coin.id)
}

module.exports.commands = [
  {
    name: BOT_PREFIX + " " + START_COMMAND,
    description: "Main menu.",
    usage: "[!" + BOT_PREFIX + " " + START_COMMAND + "]",
    verb: START_COMMAND,
    generateMessages: async inputs => [
      Promise.resolve(
        "Hi! I'm GeckoBot! You can ask me crypto questions like: \n\n" +
          "*Commands*\n" +
          "Price\t       - `!cg p <symbol>`"
      )
    ]
  },
  {
    name: BOT_PREFIX + " " + PRICE_COMMAND,
    description: "Sends the price information about the coin.",
    usage: "[!" + BOT_PREFIX + " " + PRICE_COMMAND + " coin_name]",
    verb: PRICE_COMMAND,
    generateMessages: async inputs =>
      forEachCoin(inputs, async coinId => {
        const response = await CoinGeckoClient.coins.fetch(coinId, {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
          sparkline: false
        })
        if (!response.success) throw "fetch error"
        const coin = response.data
        const message =
          "*" +
          coin.name +
          " | " +
          coin.symbol.toUpperCase() +
          "*\n\n" +
          "EUR\t: €" +
          coin.market_data.current_price.eur +
          "\n" +
          "USD\t: $" +
          coin.market_data.current_price.usd +
          "\n" +
          "BTC\t: ฿" +
          coin.market_data.current_price.btc +
          "\n" +
          "ETH\t: ♢" +
          coin.market_data.current_price.eth +
          "\n\n" +
          "Mkt Cap\t: €" +
          coin.market_data.market_cap.eur +
          "\n" +
          "Volume\t: €" +
          coin.market_data.market_cap.eur +
          "\n" +
          "24hr %\t: " +
          coin.market_data.price_change_percentage_24h +
          "%\n" +
          "7d %\t: " +
          coin.market_data.price_change_percentage_7d +
          "%\n" +
          "30d %\t: " +
          coin.market_data.price_change_percentage_30d +
          "%\n" +
          "1y %\t: " +
          coin.market_data.price_change_percentage_1y +
          "%\n\n"
        return message
      })
  },
  {
    name: BOT_PREFIX + " " + VOLUME_COMMAND,
    description: "Coin's trading Volume",
    usage: "[!" + BOT_PREFIX + " " + VOLUME_COMMAND + " coin_name]",
    verb: VOLUME_COMMAND,
    generateMessages: async inputs =>
      forEachCoin(inputs, async coinId => {
        const response = await CoinGeckoClient.coins.fetch(coinId, {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
          sparkline: false
        })
        if (!response.success) throw "fetch error"
        const coin = response.data
        const message =
          "*" +
          coin.name +
          " | " +
          coin.symbol.toUpperCase() +
          "*\n\n" +
          "Volume\t: €" +
          coin.market_data.total_volume.eur +
          "\n"
        return message
      })
  },
  {
    name: BOT_PREFIX + " " + MARKETCAP_COMMAND,
    description: "Coin's market cap",
    usage: "[!" + BOT_PREFIX + " " + MARKETCAP_COMMAND + " coin_name]",
    verb: MARKETCAP_COMMAND,
    generateMessages: async inputs =>
      forEachCoin(inputs, async coinId => {
        const response = await CoinGeckoClient.coins.fetch(coinId, {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
          sparkline: false
        })
        if (!response.success) throw "fetch error"
        const coin = response.data
        const message =
          "*" +
          coin.name +
          " | " +
          coin.symbol.toUpperCase() +
          "*\n\n" +
          "Market Cap\t: €" +
          coin.market_data.market_cap.eur +
          "\n"
        return message
      })
  },
  {
    name: BOT_PREFIX + " " + DEV_COMMAND,
    description: "Coin's development stats",
    usage: "[!" + BOT_PREFIX + " " + DEV_COMMAND + " coin_name]",
    verb: DEV_COMMAND,
    generateMessages: async inputs =>
      forEachCoin(inputs, async coinId => {
        const response = await CoinGeckoClient.coins.fetch(coinId, {
          localization: false,
          tickers: false,
          market_data: false,
          community_data: false,
          developer_data: true,
          sparkline: false
        })
        if (!response.success) throw "fetch error"
        const coin = response.data
        const message =
          "*" +
          coin.name +
          " | " +
          coin.symbol.toUpperCase() +
          "*\n\n" +
          "Forks\t: " +
          coin.developer_data.forks +
          "\n" +
          "Stars\t: " +
          coin.developer_data.stars +
          "\n" +
          "Subscribers\t: " +
          coin.developer_data.subscribers +
          "\n" +
          "Total Issues\t: " +
          coin.developer_data.total_issues +
          "\n" +
          "Closed Issued\t: " +
          coin.developer_data.closed_issues +
          "\n" +
          "PR Merged\t: " +
          coin.developer_data.pull_requests_merged +
          "\n" +
          "PR Contributors\t: " +
          coin.developer_data.pull_request_contributors +
          "\n" +
          "4-wk Commit\t: " +
          coin.developer_data.commit_count_4_weeks
        return message
      })
  },
  {
    name: BOT_PREFIX + " " + ROI_COMMAND,
    description: "ICO's Return On Investment",
    usage: "[!" + BOT_PREFIX + " " + ROI_COMMAND + " coin_name]",
    verb: ROI_COMMAND,
    generateMessages: async inputs =>
      forEachCoin(inputs, async coinId => {
        const response = await CoinGeckoClient.coins.fetch(coinId, {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
          sparkline: false
        })
        if (!response.success) throw "fetch error"
        const coin = response.data
        const message =
          "*" + coin.name + " | " + coin.symbol.toUpperCase() + "*\n\n"
        if (coin.market_data.roi)
          return (
            message +
            "ROI\t: " +
            coin.market_data.roi.times.toFixed(5) +
            "x " +
            coin.market_data.roi.currency.toUpperCase() +
            "\n"
          )
        else return message + "No ROI data for this coin"
      })
  },
  {
    name: BOT_PREFIX + " " + SOCIAL_COMMAND,
    description: "Sends the community social information about the coin.",
    usage: "[!" + BOT_PREFIX + " " + SOCIAL_COMMAND + " coin_name]",
    verb: SOCIAL_COMMAND,
    generateMessages: async inputs =>
      forEachCoin(inputs, async coinId => {
        const response = await CoinGeckoClient.coins.fetch(coinId, {
          localization: false,
          tickers: false,
          market_data: false,
          community_data: true,
          developer_data: false,
          sparkline: false
        })
        if (!response.success) throw "fetch error"
        const coin = response.data
        const message =
          "*Social Community Activity*" +
          "*" +
          coin.name +
          " | " +
          coin.symbol.toUpperCase() +
          "*\n\n" +
          "Facebook Likes\t: " +
          coin.community_data.facebook_likes +
          "\n" +
          "Twitter Followers\t: " +
          coin.community_data.twitter_followers +
          "\n" +
          "Reddit Subscribers\t: " +
          coin.community_data.reddit_subscribers +
          "\n\n" +
          "Reddit Avg Posts (48h)\t: " +
          coin.community_data.reddit_average_posts_48h +
          "\n" +
          "Reddit Avg Comments (48h)\t: " +
          coin.community_data.reddit_average_comments_48h +
          "\n" +
          "Reddit Active Accounts (48h)\t: " +
          coin.community_data.reddit_accounts_active_48h +
          "%\n\n"
        return message
      })
  },
  {
    name: BOT_PREFIX + " " + DESCRIPTION_COMMAND,
    description: "Sends the description of the coin.",
    usage: "[!" + BOT_PREFIX + " " + DESCRIPTION_COMMAND + " coin_name]",
    verb: DESCRIPTION_COMMAND,
    generateMessages: async inputs =>
      forEachCoin(inputs, async coinId => {
        const response = await CoinGeckoClient.coins.fetch(coinId, {
          localization: false,
          tickers: false,
          market_data: false,
          community_data: false,
          developer_data: false,
          sparkline: false
        })
        if (!response.success) throw "fetch error"
        const regex = /(<([^>]+)>)/ig
        return response.data.description.en.replace(regex, "")
      })
  },
]

async function forEachCoin(coins, createMessage) {
  let messages = []
  for (const coin of coins) {
    if (coin != "") {
      const ids = await getIds(coin)
      if (ids === undefined || ids.length == 0) {
        messages.push(Promise.resolve("No coins found with: " + coin))
      }
      for (const id of ids) {
        messages.push(createMessage(id))
      }
    }
  }
  if (messages.length == 0)
    messages.push(
      Promise.resolve("You need to add some coin to the command sir")
    )
  return messages
}

module.exports.BOT_PREFIX = BOT_PREFIX
