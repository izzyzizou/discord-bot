import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { addXp, readData } from "./levels.js";
import { COMMANDS } from "./enums.js";

const { PING, HELP, SAY, RANK } = COMMANDS;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case PING:
        await interaction.reply("Pong!");
      case HELP:
        await interaction.reply(
          "Here are my commands:\n" +
            "`/ping` — check if I'm alive\n" +
            "`/rank` — check your level\n" +
            "`/say` — make me say something",
        );
      case RANK:
        const data = readData();
        const userData = data[interaction.user.id] || { xp: 0, level: 1 };
        await interaction.reply(
          `You're level **${userData.level}** with **${userData.xp} XP**.`,
        );
      case SAY:
        const text = interaction.options.getString("text");
        await interaction.reply(text);
      default:
        await interaction.reply("Unkown command!");
    }
  } catch (e) {
    console.log("Error:", error);
    await interaction.reply({
      content: "Something went wrong running that command.",
      ephemeral: true,
    });
  }
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.on("error", (error) => {
  console.log("Discord client error:", error);
});

client.login(process.env.DISCORD_TOKEN);
