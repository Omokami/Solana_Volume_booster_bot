import { bot } from "..";
import walletController from "../../controller/wallet";
import { encryptPrivateKey } from "../../service";
import { removeAnswerCallback } from "./index";
const solanaWeb3 = require("@solana/web3.js");

export const walletHandler = async (msg: any) => {
  removeAnswerCallback(msg.chat);
  const user = await walletController.findOne({
    filter: {
      userId: msg.chat.id,
    },
  });
  if (!user) {
    const keypair = solanaWeb3.Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = await encryptPrivateKey(
      Buffer.from(keypair.secretKey).toString("base64")
    );

    const r = await walletController.create(msg.chat.id, publicKey, privateKey);
    if (r) {
      if (
        ![
          "/cancel",
          "/support",
          "/start",
          "/wallet",
          "/token",
          "/deposit",
          "/withdraw",
          "/balance",
          "/activity",
          "/volume",
        ].includes(msg.text)
      ) {
        bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          { chat_id: msg.chat.id, message_id: msg.message_id }
        );
      }
      bot.sendMessage(
        msg.chat.id,
        `
<b>Your Temper Wallet is connected</b>
${publicKey}

<b>You can deposit to this wallet by using this.</b>
Command line:   /deposit
        `,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Return 👈", callback_data: "return" },
                {
                  text: "Disconnect ❌",
                  callback_data: "delete_wallet",
                },
              ],
            ],
          },
        }
      );
    } else {
      if (
        ![
          "/cancel",
          "/support",
          "/start",
          "/wallet",
          "/token",
          "/deposit",
          "/withdraw",
          "/balance",
          "/volume",
          "/activity",
        ].includes(msg.text)
      ) {
        bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          { chat_id: msg.chat.id, message_id: msg.message_id }
        );
      }
      bot.sendMessage(
        msg.chat.id,
        `
<b>An error occurred on the server. 
Please try again later. </b>
        `,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[{ text: "return 👈", callback_data: "return" }]],
          },
        }
      );
    }
  } else {
    if (
      ![
        "/cancel",
        "/support",
        "/start",
        "/wallet",
        "/token",
        "/deposit",
        "/withdraw",
        "/balance",
        "/activity",
        "/volume",
      ].includes(msg.text)
    ) {
      bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: msg.chat.id, message_id: msg.message_id }
      );
    }
    bot.sendMessage(
      msg.chat.id,
      `
<b>Your Temper Wallet is connected.</b>
${user.publicKey}

You can deposit to this wallet by using this.
Command line:   /deposit
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "return 👈", callback_data: "return" },
              {
                text: "Disconnect ❌",
                callback_data: "delete_wallet",
              },
            ],
          ],
        },
      }
    );
  }
};
