import { bot } from "..";
import path from "path";
import config from "../../config.json";
import { removeAnswerCallback } from ".";
interface TuserList {
  userId: number;
  userName: string;
}
export const startHandler = async (msg: any) => {
  removeAnswerCallback(msg.chat);
  const userList = {
    userId: msg.chat.id,
    userName: msg.chat.username,
  } as TuserList;

  const videoPath = path.join(__dirname, "../../assets/AmariSilva.mp4");
  bot
    .sendVideo(
      msg.chat.id,
      videoPath,
      {
        parse_mode: "HTML",
        duration: 45,
      },
      {
        contentType: "application/octet-stream",
        filename: "AmariSilva.mp4",
      }
    )
    .then(() => {
      bot.sendMessage(
        msg.chat.id,
        `Welcome to <b>Shogun Temper Bot!</b> })

	Elevate your Liquidity Pool farms with Shogun Temper Bot’s advanced market-tempering features. 
	This tool helps you manage and stabilize low-volume times, driving consistent interest and engagement. 
	Whether it’s balancing your liquidity pool or strategically tempering market activity, Shogun Temper Bot brings subtle yet powerful support to sustain growth and attract organic participants.💥

	<b>Get Started!</b>
	Keep your market thriving with Shogun Temper Bot, expertly designed for seamless, round-the-clock stability in your liquidity pools.

	<a href="${config.websiteUrl}">Shogun Temper Bot Website</a> | <a href="${config.twitterUrl}">Twitter</a> | <a href="${config.telegramUrl}">Telegram</a> | <a href="${config.supportUrl}">Shogun Temper Bot Guide</a>`,

        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🟢  Token Setting 💰",
                  callback_data: "token_setting",
                },
                {
                  text: "🟢  Open Wallet 🤖",
                  callback_data: "open_wallet",
                },
              ],
              [
                {
                  text: "Support",
                  url: config.supportUrl,
                },
                {
                  text: "Learn more 🔗",
                  url: config.supportUrl,
                },
              ],
            ],
          },
        }
      );
    });
};
