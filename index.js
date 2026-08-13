import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { addXp, readData } from "./levels.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", (readyClient) => {
  // console.log(`Logged in As ${readyClient.user.tag}`);
  client.on("messageCreate", (message) => {
    if (message.author.bot) {
      return;
    }

    if (message.content.startsWith("!say ")) {
      const text = message.content.slice(5);
      message.channel.send(text);
    }

    if (message.content === "!ping") {
      console.log("!ping command invoked");
      message.reply("Pong!");
    }

    if (message.content === "!help") {
      console.log("!help command invoked");
      message.reply(
        "Here are my commands:\n" +
          "`!ping` — check if I'm alive\n" +
          "`!help` — show this message\n" +
          "`!rank` — to check your current message rank",
      );
    }

    if (message.content === "!rank") {
      const data = readData();
      const userData = data[message.author.id] || { xp: 0, level: 1 };
      message.reply(
        `You're level **${userData.level}** with **${userData.xp} XP**.`,
      );
    }

    const { level, leveledUp } = addXp(message.author.id, 10);
    if (leveledUp) {
      message.channel.send(
        `🎉 ${message.author} leveled up to **level ${level}**!`,
      );
    }
  });
});

client.login(process.env.DISCORD_TOKEN);
