import { bot } from "../index";
import { answerCallbacks } from "../index";
import { Message } from "node-telegram-bot-api";

export const removeAnswerCallback = (chat: any) => {
  answerCallbacks[chat.id] = null;
  delete answerCallbacks[chat.id];
};
export const generateCallbackOption = (message: Message, mode: string) => {
  return {
    chat_id: message.chat.id,
    message_id: message.message_id,
    parse_mode: mode,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Go to Main",
            callback_data: "admin_ui",
          },
        ],
      ],
    },
  };
};
export const sendMessage = async (userid: string, message: string) => {
  await bot.sendMessage(userid, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
};

export const deleteMessage = async (message: Message) => {
  try {
    await bot.deleteMessage(message.chat.id, message.message_id);
  } catch (err) {
    console.error("deleteMessage = ", err);
  }
};

export const deleteMessage1 = async (message: Message, message_id: number) => {
  try {
    console.log("ffffffffffff", message_id);
    await bot.deleteMessage(message.chat.id, message_id);
  } catch (err) {
    console.error("deleteMessage = ", err);
  }
};
