const Bot = require('keybase-bot')
const Gecko = require('./handlers');

const bot = new Bot()
const BOT_PREFIX = "coingecko"
const PRICE_COMMAND = "price"
const START_COMMAND = "start"
const VOLUME_COMMAND = "volume"
const MARKETCAP_COMMAND = "marketcap"
const DEV_COMMAND = "dev"

async function main() {
  try {
    const username = process.env.KB_USERNAME
    const paperkey = process.env.KB_PAPERKEY
    await bot.init(username, paperkey)
    const info = bot.myInfo()
    console.log(`CoingeckoBot bot initialized with username ${info.username}.`)

    await bot.chat.clearCommands()
    await bot.chat.advertiseCommands({
      advertisements: [{
        type: 'public',
        commands: [{
            name: BOT_PREFIX + ' ' + PRICE_COMMAND,
            description: 'Sends the price information about the coin.',
            usage: '[!' + BOT_PREFIX + ' ' + PRICE_COMMAND + ' coin_name]',
          },
          {
            name: BOT_PREFIX + ' ' + START_COMMAND,
            description: 'Main menu.',
            usage: '[!' + BOT_PREFIX + ' ' + START_COMMAND + ']',
          },
          {
            name: BOT_PREFIX + ' ' + VOLUME_COMMAND,
            description: "Coin's trading Volume",
            usage: '[!' + BOT_PREFIX + ' ' + VOLUME_COMMAND + ' coin_name]',
          },
          {
            name: BOT_PREFIX + ' ' + MARKETCAP_COMMAND,
            description: "Coin's market cap",
            usage: '[!' + BOT_PREFIX + ' ' + MARKETCAP_COMMAND + ' coin_name]',
          },
          {
            name: BOT_PREFIX + ' ' + DEV_COMMAND,
            description: "Coin's development stats",
            usage: '[!' + BOT_PREFIX + ' ' + DEV_COMMAND + ' coin_name]',
          },
        ]
      }],
    })

    const onMessage = async messageIn => {
      let messages
      if (messageIn.content.type !== 'text') {
        return
      }

      const body = messageIn.content.text.body
      const words = body.split(' ')
      const [prefix, verb, ...symbols] = words
      if (prefix !== '!' + BOT_PREFIX) {
        return
      }
      console.log("verb: " + verb)
      switch (verb) {
        case START_COMMAND:
          bot.chat.send(messageIn.channel, {
            body: Gecko.generateStartMessage()
          })
          return
        case PRICE_COMMAND:
          messages = await Gecko.generatePriceMessages(symbols)
          for (const message of messages) {
            bot.chat.send(messageIn.channel, {
              body: await message
            })
          }
          return
        case VOLUME_COMMAND:
          messages = await Gecko.generateVolumeMessages(symbols)
          for (const message of messages) {
            bot.chat.send(messageIn.channel, {
              body: await message
            })
          }
          return
        case MARKETCAP_COMMAND:
          messages = await Gecko.generateMarketCapMessages(symbols)
          for (const message of messages) {
            bot.chat.send(messageIn.channel, {
              body: await message
            })
          }
          return
        case DEV_COMMAND:
          messages = await Gecko.generateDevMessages(symbols)
          for (const message of messages) {
            bot.chat.send(messageIn.channel, {
              body: await message
            })
          }
          return
        default:
          bot.chat.send(messageIn.channel, {
            body: 'Unknown command: ' + verb
          })
      }
    }

    const onError = e => console.error(e)
    console.log(`Listening for messages...`)
    await bot.chat.watchAllChannelsForNewMessages(onMessage, onError)
  } catch (error) {
    console.error(error)
  }
}

async function shutDown() {
  await bot.deinit()
  process.exit()
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)

main();