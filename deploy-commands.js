import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if the bot is alive'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('List available commands'),

  new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your level and XP'),

  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See the top users by level and XP'),

  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('What the bot should say')
        .setRequired(true)
    ),
].map(command => command.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Slash commands registered successfully.');
  } catch (error) {
    console.error(error);
  }
})();
