import "dotenv/config";
import { Client, GatewayIntentBits, InteractionType } from "discord.js";
import { addXp, readData, getLeaderboard } from "./levels.js";
import { COMMANDS } from "./enums.js";

const { PING, HELP, SAY, RANK, LEADERBOARD } = COMMANDS;

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
    await interaction.deferReply();

    switch (commandName) {
      case PING:
        await interaction.editReply("Pong!");
        break;
      case HELP:
        await interaction.editReply(
          "Here are my commands:\n" +
            "`/ping` — check if I'm alive\n" +
            "`/rank` — check your level\n" +
            "`/leaderboard` — see top users\n" +
            "`/say` — make me say something",
        );
        break;
      case RANK: {
        const data = readData();
        const userData = data[interaction.user.id] || { xp: 0, level: 1 };
        await interaction.editReply(
          `You're level **${userData.level}** with **${userData.xp} XP**.`,
        );
        break;
      }
      case LEADERBOARD: {
        const top = getLeaderboard();
        if (top.length === 0) {
          await interaction.editReply("No users have earned XP yet.");
          break;
        }
        const lines = top.map(
          (row, i) =>
            `${i + 1}. <@${row.user_id}> — Level **${row.level}** (${row.xp} XP)`,
        );
        await interaction.editReply("**Leaderboard**\n" + lines.join("\n"));
        break;
      }
      case SAY:
        await interaction.editReply(interaction.options.getString("text"));
        break;
      default:
        await interaction.editReply("Unknown command!");
    }
  } catch (e) {
    console.log("Error:", e);
    try {
      await interaction.editReply({
        content: "Something went wrong running that command.",
      });
    } catch (replyError) {
      console.log("Failed to edit reply:", replyError);
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  const result = addXp(message.author.id, 15);

  if (result.leveledUp) {
    await message.channel.send(
      `Congrats <@${message.author.id}>, you're now level **${result.level}**!`,
    );
  }
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.on("error", (error) => {
  console.log("Discord client error:", error);
});

client.login(process.env.DISCORD_TOKEN);
