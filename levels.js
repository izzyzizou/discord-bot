import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "data", "levels.db"));
const COOLDOWN_MS = 60 * 1000;

// create the table if it doesn't exist yet - safe to run every startup
db.exec(`CREATE TABLE IF NOT EXISTS levels (
  user_id TEXT PRIMARY KEY,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1
  )`);

const getUserStatement = db.prepare(
  "SELECT xp, level FROM levels WHERE user_id = ?",
);
const insertUserStatement = db.prepare(
  "INSERT INTO levels (user_id, xp, level) VALUES (?, 0, 1)",
);
const updateUserStatement = db.prepare(
  "UPDATE levels SET xp = ?, level = ? WHERE user_id = ?",
);

// tracks the last time each user earned XP: userId -> timestamp
const cooldowns = new Map();

function getUser(userId) {
  let user = getUserStatement.get(userId);
  if (!user) {
    insertUserStatement.run(userId);
    user = { xp: 0, level: 1 };
  }

  return user;
}

function addXp(userId, amount) {
  const now = Date.now();
  const lastEarned = cooldowns.get(userId) || 0;

  if (now - lastEarned < COOLDOWN_MS) {
    return { onCooldown: true };
  }

  cooldowns.set(userId, now);

  const user = getUser(userId);
  user.xp += amount;

  const xpNeeded = user.level * 100;
  let leveledUp = false;

  if (user.xp >= xpNeeded) {
    user.xp -= xpNeeded;
    user.level += 1;
    leveledUp = true;
  }

  updateUserStatement.run(user.xp, user.level, userId);

  return { level: user.level, leveledUp, onCooldown: false };
}

function readData() {
  const rows = db.prepare("SELECT user_id, xp, level FROM levels").all();
  const data = {};
  for (const row of rows) {
    data[row.user_id] = { xp: row.xp, level: row.level };
  }
  return data;
}

export { addXp, readData };
