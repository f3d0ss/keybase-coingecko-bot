const Bot = require('keybase-bot')
const Gecko = require('./handlers');

const bot = new Bot()

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
            name: 'price',
            description: 'Sends the price information about the coin.',
            usage: '[!cg p coin_name]',
          },
          {
            name: 'start',
            description: 'Main menu.',
            usage: '[!cg start]',
          },
          {
            name: 'volume',
            description: "Coin's trading Volume",
            usage: '[!cg v coin_name]',
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
      if (prefix !== "!cg") {
        return
      }
      console.log("verb: " + verb)
      switch (verb) {
        case 'start':
          bot.chat.send(messageIn.channel, {
            body: Gecko.generateStartMessage()
          })
          return
        case 'p':
          messages = await Gecko.generatePriceMessages(symbols)
          for (const message of messages) {
            bot.chat.send(messageIn.channel, {
              body: await message
            })
          }
          return
        case 'v':
          messages = await Gecko.generateVolumeMessages(symbols)
          for (const message of messages) {
            bot.chat.send(messageIn.channel, {
              body: await message
            })
          }
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

async function shutDown() {
  await bot.deinit()
  process.exit()
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)

main();