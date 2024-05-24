import { IRequest, IChatBot } from "../type";
import { OpenAIChatBot } from "./openai";
import { QianfanChatBot } from "./qianfan";

const registeredChatBots = new Map<string, IChatBot>([
    ["openai", new OpenAIChatBot()],
    ["qianfan", new QianfanChatBot()],
]);

export const getBot = (req?: IRequest): IChatBot => {
    if (req == undefined) {
        return undefined;
    }
    const name = req.request.chat_bot || req.env.CHAT_BOT || "openai";
    let bot = registeredChatBots.get(name);
    console.log(`${name} get bot`, bot);
    return bot;
};
