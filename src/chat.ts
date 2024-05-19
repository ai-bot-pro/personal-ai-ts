import OpenAI from "openai";
import { ChatHistory } from "./history";
import { FunctionHandler } from "./functions";
import { IRequest, IFunction } from "./type";

function removeDuplicateBraces(jsonString: string): string {
  const match = jsonString.match(/^{\s*"({.*})"\s*}$/);

  if (match && match[1]) {
    return match[1].trim();
  }
  return jsonString;
}
export const getClient = (req: IRequest): { client: OpenAI; model: string } => {
  const chat_conf = req.request.config?.chat;
  const url = chat_conf?.api_base || req.env.API_BASE || "https://api.groq.com/openai/v1/";
  const apiKey = chat_conf?.api_key || req.env.API_KEY;
  const client = new OpenAI({ apiKey });
  client.baseURL = url;
  const model = chat_conf?.model || req.env.MODEL || "llama3-70b-8192";
  return { client, model };
};

export const handle = async (req: IRequest): Promise<string> => {
  const openai = getClient(req);
  const defaultSystemPrompt = `
    You are Siri Ultra. Answer in 1-2 sentences. Be friendly, helpful and concise. 
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
  const chat = ChatHistory.getInstance(req.env.siri_ai_chats);
  await chat.add(req.request.chat_id, {
    role: "user",
    content: req.request.input,
  });
  let response = "";
  const func_tools: IFunction[] = FunctionHandler.getFunctions(req);
  while (true) {
    const ask = await openai.client.chat.completions.create({
      model: openai.model,
      messages: [
        { role: "system", content: system },
        ...(await chat.get(req.request.chat_id)),
      ],
      tools: func_tools,
    });
    console.log("ask_response:", ask);
    console.log("message:", ask.choices[0].message);
    if (ask.choices[0].message.tool_calls) {
      chat.add(req.request.chat_id, {
        role: "assistant",
        name: "tool",
        tool_calls: ask.choices[0].message.tool_calls,
      });
      for (const tool of ask.choices[0].message.tool_calls) {
        let cleanedArguments = tool.function.arguments;
        console.log("tool.function:", tool.function);
        if (openai.model.includes("moonshot")) {
          cleanedArguments = removeDuplicateBraces(cleanedArguments);
        }
        const result = await FunctionHandler.handle(
          tool.function.name,
          JSON.parse(cleanedArguments),
          req,
          func_tools,
        );
        console.log(tool.function.name, "result:", result);
        await chat.add(req.request.chat_id, {
          role: "tool",
          tool_call_id: tool.id,
          content: result,
        });
      }
    }
    if (ask.choices[0].finish_reason === "stop") {
      response = ask.choices[0].message.content;
      await chat.add(req.request.chat_id, {
        role: "assistant",
        content: response,
      });
      break;
    }
  }
  return response;
};