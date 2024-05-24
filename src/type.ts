import OpenAI from "openai";
import { ChatHistory } from "./history";

export interface ISearch {
  search_name?: string;// search_api,search1_api,serper_api etc...
  search1_api_key?: string;
  search_api_key?: string;
  serper_api_key?: string;
}

export interface IOpenaiChat { // openai chat completions api style
  model?: string;
  api_base?: string;
  system_prompt?: string;
  api_key?: string;
}

export interface IQianfanAPP { // baidu qianfan application
  model?: string;
  api_key?: string;
  secret_key?: string;
}

export interface IBody {
  chat_id: string;
  input: string;
  date: string;
  chat_bot?: string; //openai | qianfan, default openai
  chat_type?: string; //chat_only | chat_with_functions, default chat_only
  config?: {
    chat?: IOpenaiChat;
    qianfan?: IQianfanAPP;
    search?: ISearch;
  };
}


export interface IRequest {
  env: any;
  request: IBody;
}

export type IFunction = OpenAI.Chat.Completions.ChatCompletionTool & {
  execute: (params: any, req: IRequest) => Promise<string>;
};

export type IChatBot = {
  chat: (req: IRequest, chat: ChatHistory, system: string) => Promise<string>;
  chatWithFunctions: (req: IRequest, chat: ChatHistory, system: string) => Promise<string>;
};