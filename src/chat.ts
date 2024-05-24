import { ChatHistory } from "./history";
import { IRequest } from "./type";
import { getBot } from "./bots/api";

const botChat = async (req: IRequest, chat: ChatHistory, system: string): Promise<string> => {
  let bot = getBot(req);
  if (bot == undefined) {
    return "bot undefined";
  }
  let response = ""
  const chat_type = req.request.chat_type || req.env.CHAT_TYPE || "chat_only";
  switch (chat_type) {
    case "chat_only":
      response = await bot.chat(req, chat, system)
      break
    case "chat_with_functions":
      response = await bot.chatWithFunctions(req, chat, system)
      break
    default:
      return `${chat_type} unsupport`
  }
  return response;
};

export const handle = async (req: IRequest): Promise<string> => {
  const defaultSystemPrompt = `
    You are oligei. Answer in 1-2 sentences. Be friendly, helpful and concise. 
    Default to metric units when possible. Keep the conversation short and sweet. 
    You only answer in text. Don't include links or any other extras. 
    Don't respond with computer code, for example don't return user longitude.
  `;

  const chat_conf = req.request.config?.chat;
  const customSystemPrompt = chat_conf?.system_prompt || req.env.SYSTEM_PROMPT || defaultSystemPrompt;

  const system = `
    ${customSystemPrompt}
    User's current info:
    date: ${req.request.date}
  `;
  const chat = ChatHistory.getInstance(req.env.ai_chats);
  await chat.add(req.request.chat_id, {
    role: "user",
    content: req.request.input,
  });

  let response = "";
  let content = "";
  try {
    response = await botChat(req, chat, system);
    content = response;
  } catch (error) {
    console.log(error);
    response = "Sorry, I'm having trouble understanding your request. Please try again.";
  }
  await chat.add(req.request.chat_id, {
    role: "assistant",
    content: content,
  });
  return response;
};