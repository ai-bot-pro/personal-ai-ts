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

export interface IWeather {
  weather_name?: string;// openweahtermap_api
  openweahtermap_api_key?: string;
}

export interface IBody {
  chat_id: string;
  input: string;
  date: string;
  location?: {
    latitude: number;
    longitude: number;
    lang?: string;
  };
  chat_bot?: string; //openai | qianfan, default openai
  chat_type?: string; //chat_only | chat_with_functions, default chat_only
  config?: {
    chat?: IOpenaiChat;
    qianfan?: IQianfanAPP;
    search?: ISearch;
    weather?: IWeather;
  };
}

export interface IRequest {
  env: any;
  request: IBody;
}

export interface IQianfanChatCompletionFunction {
  /**
 * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
 * underscores and dashes, with a maximum length of 64.
 */
  name: string;

  /**
   * A description of what the function does, used by the model to choose when and
   * how to call the function.
   */
  description?: string;

  /**
   * The parameters the functions accepts, described as a JSON Schema object. See the
   * [guide](https://platform.openai.com/docs/guides/text-generation/function-calling)
   * for examples, and the
   * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
   * documentation about the format.
   *
   * Omitting `parameters` defines a function with an empty parameter list.
   */
  parameters?: OpenAI.FunctionParameters;

  responses?: OpenAI.FunctionParameters;
  examples?: OpenAI.ChatCompletionMessageParam[];
}

export interface IQianfanChatCompletionTool {
  function: IQianfanChatCompletionFunction;

  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
}

export type ChatCompletionTool = (OpenAI.Chat.Completions.ChatCompletionTool | IQianfanChatCompletionTool);

export type IFunction = ChatCompletionTool & {
  execute: (params: any, req: IRequest) => Promise<string>;
};

export type IChatBot = {
  chat: (req: IRequest, chat: ChatHistory, system: string) => Promise<string>;
  chatWithFunctions: (req: IRequest, chat: ChatHistory, system: string) => Promise<string>;
};