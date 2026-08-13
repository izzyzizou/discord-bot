import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "data", "levels.json");

export function readData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function addXp(userId, amount) {
  const data = readData();

  if (!data[userId]) {
    data[userId] = { xp: 0, level: 1 };
  }

  data[userId].xp += amount;

  const xpNeeded = data[userId].level * 100;
  let leveledUp = false;

  if (data[userId].xp >= xpNeeded) {
    data[userId].xp -= xpNeeded;
    data[userId].level += 1;
    leveledUp = true;
  }

  writeData(data);

  return { level: data[userId].level, leveledUp };
}
