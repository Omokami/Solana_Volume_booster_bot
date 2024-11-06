import { bot } from "../index";
import depositController from "../../controller/deposit";
import walletController from "../../controller/wallet";
import {
  checkSolBalance,
  checkSplTokenBalance,
} from "../../service/getBalance";
import config from "../../config.json";
import axios from "axios";
import { removeAnswerCallback } from "./index";
let tokenAccount = "" as any;

export const balanceHandler = async (msg: any) => {
  removeAnswerCallback(msg.chat);
  tokenAccount = "";
  const user = await walletController.findOne({
    filter: {
      userId: msg.chat.id,
    },
  });
  if (user) {
    const tokenInfo = await depositController.findOne({
      filter: { userId: msg.chat.id },
    });
    if (tokenInfo) {
      for (let i = 0; i < tokenInfo.tokenAddress.length; i++) {
        if (tokenInfo.tokenAddress[i] === config.solTokenAddress) {
          const balance = await checkSolBalance(user.publicKey);
          tokenAccount += `
<b>Name: </b>  Solana
<b>Symbol: </b>  SOL
<b>Token Address:</b>  <code>${tokenInfo.tokenAddress[i]}</code>
<b>Balance: </b>  ${balance} 
 `;
        } else {
          const balance = await checkSplTokenBalance(
            tokenInfo.tokenAddress[i],
            user.publicKey
          );
          const r = await getTokenInfo(tokenInfo.tokenAddress[i]);
          if (r) {
            tokenAccount += `
<b>Name: </b>  ${r?.name}
<b>Symbol: </b>  ${r?.symbol}
<b>Token Address: </b>  <code>${r?.address}</code>
<b>Balance: </b>  ${balance}
 `;
          }
        }
      }
      await balanceModal(msg);
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
      bot.sendMessage(msg.chat.id, `Please add tokens to your wallet.`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Return  👈", callback_data: "return" }]],
        },
      });
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
    bot.sendMessage(msg.chat.id, `Connect your wallet to continue.`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Return  👈", callback_data: "return" }]],
      },
    });
  }
};

const balanceModal = async (msg: any) => {
  bot.sendMessage(
    msg.chat.id,
    `
<b>Here is your current wallet balance:</b> 
${tokenAccount}`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Return  👈", callback_data: "return" }]],
      },
    }
  );
};

const getTokenInfo = async (tokenAddress: string) => {
  try {
    const response = await axios(`${config.dexAPI}/${tokenAddress}`);
    if (response?.status == 200 && response?.data?.pairs) {
      const data = response.data.pairs[0];
      let token = {
        address: tokenAddress,
        name: data.baseToken.name,
        symbol: data.baseToken.symbol,
      };
      return token;
    } else {
      console.log("API request failed.");
      return null;
    }
  } catch (err) {
    console.log("error: ", err);
    return null;
  }
};
