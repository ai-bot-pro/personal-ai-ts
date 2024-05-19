import OpenAI from "openai";

export interface ISearch {
  search_name?: string;// search_api,search1_api,serper_api etc...
  search1_api_key?: string;
  search_api_key?: string;
  serper_api_key?: string;
}

export interface IChat { // openai chat completions api style
  model?: string;
  api_base?: string;
  system_prompt?: string;
  api_key?: string;
}

export interface IBody {
  chat_id: string;
  input: string;
  date: string;
  config?: {
    chat?: IChat;
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
