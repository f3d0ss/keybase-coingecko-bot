//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
const Bot = require('keybase-bot')

let allCoins;


//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();
const bot = new Bot()


async function getIds(name) {
    let lowerName = name.toLowerCase();
    console.log("lowerName: "+lowerName);
    if (allCoins === undefined || allCoins.code != 200){
        allCoins = await CoinGeckoClient.coins.list();
    }
    if (allCoins.code != 200){
        console.log(allCoins);
        throw 'server error';
    }

   return allCoins.data.filter(coin => coin.id == lowerName || coin.symbol == lowerName || coin.name == lowerName).map(coin => coin.id);
    
};

async function printMessage(coinId) {
    let response = await CoinGeckoClient.coins.fetch(coinId, {localization: false, tickers: false, community_data: false, developer_data: false, sparkline: false});
    if (!response.success)
        throw 'fetch error';
    let coin = response.data;
    let message = "*" + coin.name + " | " + coin.symbol + "*\n\n" +
                "EUR\t: €" + coin.market_data.current_price.eur + "\n" +
                "USD\t: $" + coin.market_data.current_price.usd + "\n" +
                "BTC\t: ฿" + coin.market_data.current_price.btc + "\n" +
                "ETH\t: ♢" + coin.market_data.current_price.eth + "\n\n" +
                "Mkt Cap\t: €" + coin.market_data.market_cap.eur + "\n" +
                "Volume\t: €" + coin.market_data.market_cap.eur + "\n" +
                "24hr %\t: " + coin.market_data.price_change_percentage_24h + "%\n" +
                "7d %\t: " + coin.market_data.price_change_percentage_7d + "%\n" +
                "30d %\t: " + coin.market_data.price_change_percentage_30d + "%\n" +
                "1y %\t: " + coin.market_data.price_change_percentage_1y + "%\n\n";
    console.log(message);
    return message;

}



async function main() {
    try {
      const username = process.env.KB_USERNAME
      const paperkey = process.env.KB_PAPERKEY
      await bot.init(username, paperkey)
      const info = bot.myInfo()
      console.log(`CoingeckoBot bot initialized with username ${info.username}.`)
  
      await bot.chat.clearCommands()
      await bot.chat.advertiseCommands({
        advertisements: [
          {
            type: 'public',
            commands: [
              {
                name: 'price',
                description: 'Sends the price information about the coin.',
                usage: '[!cg p coin_name]',
              },
              {
                name: 'scam',
                description: 'Sends scam.',
                usage: '[!cg scam]',
              },
            ]
          }
        ],
      })
  
      const onMessage = async message => {

        if (message.content.type !== 'text') {
          return
        }
        

        const body = message.content.text.body
        const words = body.split(' ')
        const [prefix, verb, ...namespace] = words
        if (prefix !== "!cg") {
          return
        }
        switch(verb){
          case 'start':
              handleStart(message.channel)
              return
          case 'p':
              handlePrice(namespace, message.channel)
              return
          default:
              throw new Error(`Unknown command ${body}.`)
        }      
      }
  
      const onError = e => console.error(e)
      console.log(`Listening for messages...`)
      await bot.chat.watchAllChannelsForNewMessages(onMessage, onError)
    } catch (error) {
      console.error(error)
    }
}

async function handlePrice(coins, channel) {
  for (const coin of coins){
    console.log("coin:\t"+ coin);
    const ids = await getIds(coin);
    if (ids === undefined || ids.length == 0){
        bot.chat.send(channel, {
            body: "No coins found with: " + coin
          })
    }
    console.log("ids: " +ids);
    for (const id of ids) {
        bot.chat.send(channel, {
          body: await printMessage(id)
        })  
    }
  }
}

async function handleStart(channel) {
  bot.chat.send(channel, {
    body: "Hi! I'm GeckoBot! You can ask me crypto questions like: \n\n" +
          "*Commands*\n" +
          "Price\t       - !cg p <symbol>"
  })
}


async function shutDown() {
  await bot.deinit()
  process.exit()
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)
  
main();