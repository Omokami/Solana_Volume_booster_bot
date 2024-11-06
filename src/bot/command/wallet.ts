import { walletHandler } from "../library/walletHandler";
import { bot } from "../index";
const { Commands } = require("../index.ts");

export default new Commands(
  new RegExp(/^\/wallet/),
  "Wallet Bot",
  "wallet",
  true,
  async (msg: any) => {
    const fromId = msg.from.id;
    const chatId = msg.chat.id;
    if (fromId != chatId) {
      bot.sendMessage(msg.chat.id, `No permission`, {});
      return;
    }
    walletHandler(msg);
  }
);
