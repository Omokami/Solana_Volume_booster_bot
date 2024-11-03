import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import { callBackHandler } from "./callback";
import config from "../config.json";
import { removeAnswerCallback } from "./library";

let TOKEN = config.TOKEN;

export const bot = new TelegramBot(TOKEN, {
  polling: true,
});

export let answerCallbacks = {} as any;

bot.on("message", function (message) {
  var callback = answerCallbacks[message.chat.id];
  const msgStr = message.text;
  if (msgStr == "/cancel" && callback) {
    delete answerCallbacks[message.chat.id];
    return;
  }
  if (callback) {
    delete answerCallbacks[message.chat.id];
    return callback(message);
  }
});
bot.on("polling_error", console.log);

async function loadEvents() {
  bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    callBackHandler(msg, action);
  });
}

async function loadCommands() {
  let commands = [] as any;
  for (const vo of fs.readdirSync(__dirname + "/command")) {
    if (path.extname(vo) === ".ts") {
      if (!fs.lstatSync(__dirname + "/command/" + vo).isDirectory()) {
        await import("./command/" + vo).then((module) => {
          const command = module.default;
          bot.onText(command.reg, (msg) => {
            command.fn(msg);
            removeAnswerCallback(msg.chat);
          });
          if (command.isCommands) {
            commands.push({
              command: command.cmd,
              description: command.descript,
            });
          }
          if (command.cb) {
            bot.on("callback_query", command.cb);
          }
        });
      }
    }
  }
  bot
    .setMyCommands(commands)
    .then((res) => {
      console.log(
        `Register bot menu commands${res ? "success" : "fail"} ${
          commands.length
        }个`
      );
    })
    .catch((err) => {
      console.log("The menu command for registering bot is wrong", err.message);
    });
}

export class Commands {
  constructor(
    reg: RegExp,
    descript: string,
    cmd: string,
    isCommands: boolean,
    fn: Function,
    cb: Function
  ) {
    this.reg = reg;
    this.descript = descript;
    this.cmd = cmd;
    this.isCommands = isCommands;
    this.fn = fn;
    this.cb = cb;
  }
  reg: any;
  descript: string;
  cmd: string;
  isCommands: boolean;
  fn: Function;
  cb: Function;
}
export class Events {
  constructor(event: string, fn: Function, cb: Function) {
    this.event = event;
    this.fn = fn;
    this.cb = cb;
  }

  event: string;
  fn: Function;
  cb: Function;
}
export function getCmd(text: string) {
  const cmd = text.split(" ");
  const result = [];
  for (let i = 0; i < cmd.length; i++) {
    if (cmd[i] != " " && cmd[i] != "") {
      result.push(cmd[i]);
    }
  }
  return result;
}

export const initBot = () => {
  loadCommands();
  loadEvents();
};
