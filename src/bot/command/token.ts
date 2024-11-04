import { tokenSettingHandler } from "../library/tokenSettingHandler";
import { bot } from "../index";
const { Commands } = require("../index.ts");

export default new Commands(
  new RegExp(/^\/token/),
  "TokenSetting Bot",
  "token",
  true,
  async (msg: any) => {
    const fromId = msg.from.id;
    const chatId = msg.chat.id;
    if (fromId != chatId) {
      bot.sendMessage(msg.chat.id, `No permission`, {});
      return;
    }
    tokenSettingHandler(msg);
  }
);
