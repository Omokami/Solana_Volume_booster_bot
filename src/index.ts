import { connectDatabase } from "./db";
import { initBot } from "./bot";
import config from "./config.json";

async function start() {
  await connectDatabase(config.database);
  initBot();
}
start();
