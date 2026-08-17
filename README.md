# discord-bot

A basic Discord bot that tracks user XP and levels. Members level up simply by
sending messages in the server — no commands or setup needed on their part.

## What it does

- **Awards XP for chatting.** Every non-bot message earns the author 15 XP, with
  a 10-second per-user cooldown so spamming doesn't farm levels.
- **Levels users up.** Reaching `level × 100` XP consumes that XP, bumps the
  user to the next level, and the bot announces it in the channel.
- **Persists progress.** Stats live in a SQLite database (`data/levels.db`), so
  levels survive restarts and redeploys.

### Slash commands

| Command       | What it does                                  |
| ------------- | --------------------------------------------- |
| `/ping`       | Check if the bot is alive                     |
| `/help`       | List available commands                       |
| `/rank`       | Show your current level and XP                |
| `/leaderboard`| Show the top 10 users by XP                   |
| `/say <text>` | Make the bot repeat something                 |

## Why it's useful

Most public leveling bots are heavy, ad-supported, or require handing your
server's data to a third party. This one is a few hundred lines of readable
JavaScript you host yourself: you own the database, you can change the XP rules
in one file, and there's nothing to configure beyond a bot token. It's also a
compact, practical example of a `discord.js` v14 bot using slash commands and
SQLite — a reasonable starting point if you're building your own.

## Getting started

### Requirements

- Node.js 18 or newer
- A Discord application and bot ([Discord Developer Portal](https://discord.com/developers/applications))

### 1. Install

```bash
git clone git@github.com:izzyzizou/discord-bot.git
cd discord-bot
npm install
```

### 2. Configure

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable        | Required | Description                                                        |
| --------------- | -------- | ------------------------------------------------------------------ |
| `DISCORD_TOKEN` | yes      | Bot token from the Developer Portal → your app → Bot               |
| `CLIENT_ID`     | yes      | Application ID from the Developer Portal → your app → General      |
| `DB_PATH`       | no       | Override the SQLite file location (defaults to `data/levels.db`)    |

In the Developer Portal, enable the **Message Content Intent** under Bot →
Privileged Gateway Intents. Without it the bot can't see messages and no XP is
awarded. Then invite the bot to your server with the `bot` and
`applications.commands` scopes.

### 3. Register the slash commands

Run this once, and again any time you add or change a command:

```bash
node deploy-commands.js
```

### 4. Run the bot

```bash
npm start
```

The database and its table are created automatically on first run.

### Deploying

The only state is the SQLite file. When running in a container, mount a volume
and point `DB_PATH` at it (for example `DB_PATH=/data/levels.db`) so progress
isn't lost when the container is replaced.

## Where to get help

- Open an [issue](https://github.com/izzyzizou/discord-bot/issues) for bugs or
  questions about this bot.
- For questions about the Discord API itself, see the
  [discord.js guide](https://discordjs.guide/) and
  [Discord developer docs](https://discord.com/developers/docs/intro).

## Maintainers and contributing

Maintained by [@izzyzizou](https://github.com/izzyzizou). Contributions are
welcome — open an issue to discuss a change, or send a pull request.

Where things live:

| File                 | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `index.js`           | Client setup, command handling, XP-on-message listener     |
| `levels.js`          | SQLite access, XP/level math, cooldowns                    |
| `deploy-commands.js` | Registers slash commands with Discord                      |
| `enums.js`           | Command name constants                                     |

## License

ISC
