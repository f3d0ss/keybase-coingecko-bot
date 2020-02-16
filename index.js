const Bot = require("keybase-bot");
const Commands = require("./commands");

const bot = new Bot();
const commands = Commands.commands;

async function main() {
  try {
    const username = process.env.KB_USERNAME;
    const paperkey = process.env.KB_PAPERKEY;
    await bot.init(username, paperkey);
    const info = bot.myInfo();
    console.log(`CoingeckoBot bot initialized with username ${info.username}.`);

    // console.log(commands)
    await bot.chat.clearCommands();
    await bot.chat.advertiseCommands({
      advertisements: [
        {
          type: "public",
          commands: commands.map(command => {
            return {
              name: command.name,
              description: command.description,
              useage: command.useage
            };
          })
        }
      ]
    });

    const onMessage = async messageIn => {
      let messages;
      if (messageIn.content.type !== "text") {
        return;
      }

      const body = messageIn.content.text.body;
      const words = body.split(" ");
      const [prefix, verb, ...symbols] = words;
      if (prefix !== "!" + Commands.BOT_PREFIX) {
        return;
      }
      console.log("verb: " + verb);

      for (const command of commands) {
        if (command.verb == verb) {
          messages = await command.generateMessages(symbols);
          for (const message of messages) {
            bot.chat.send(messageIn.channel, {
              body: await message
            });
          }
          return;
        }
      }

      bot.chat.send(messageIn.channel, {
        body: "Command not found"
      });
      return;
    };

    const onError = e => console.error(e);
    console.log(`Listening for messages...`);
    await bot.chat.watchAllChannelsForNewMessages(onMessage, onError);
  } catch (error) {
    console.error(error);
  }
}

async function shutDown() {
  await bot.deinit();
  process.exit();
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);

main();
