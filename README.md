# Keybase Coingecko Bot
This is a simple bot for keybase that retrives some data on crypto from [Coingecko](https://coingecko.com).

It aim to be like the CoingeckoBot on Telegram.

### Contribution
If you want to help adding command you just need to add the verb as a constant and an object in the commands array in commands.js
##### The constant:
`const NEW_COMMAND = "mycommand";`
##### The object: 
```
{
    name: BOT_PREFIX + " " + NEW_COMMAND,
    description: "Description of the new command.",
    usage: "[!" + BOT_PREFIX + " " + NEW_COMMAND + "]",
    verb: NEW_COMMAND,
    generateMessages: async lambda that return an array of promise 
                      resolving in messages to be send to the chat
}
```