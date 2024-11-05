import { depositHandler } from "../library/depositHandler";
import { bot } from "../index";
const { Commands } = require("../index.ts");

export default new Commands(
  new RegExp(/^\/deposit/),
  "Deposit bot",
  "deposit",
  true,
  async (msg: any) => {
    const fromId = msg.from.id;
    const chatId = msg.chat.id;
    if (fromId != chatId) {
      bot.sendMessage(msg.chat.id, `No permission`, {});
      return;
    }
    depositHandler(msg);
  }
);
