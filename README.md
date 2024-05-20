# personal-ai-ts [中文](./README-cn.md)

This is a personal ai tool that works with clients, such as Apple Shortcuts removing the need for a dedicated hardware device. from: [fatwang2/siri-ultra](https://github.com/fatwang2/siri-ultra), [Sh4yy/personal-ai](https://github.com/Sh4yy/personal-ai) & [honojs/hono-minimal](https://github.com/honojs/hono-minimal)

## How it works

The assistant is run on Cloudflare Workers and can work with any LLM model. 


### Getting Started

1. **Clone the repository**:
   - Clone this repository and navigate to the root directory.

2. **Install dependencies**:
   - Run `npm install` to install the necessary dependencies.

3. **Authenticate with Cloudflare**:
   - Run `npx wrangler login` to log in to your Cloudflare account.

4. **Create KV namespaces**:
   - Run `npx wrangler kv:namespace create chats` to create a KV namespace. Note down the ID.

5. **Configure the project**:
   - Update `wrangler.toml` with the namespace IDs:

   ```toml
      [[kv_namespaces]]
      binding = "siri_ai_chats"
      id = "<id>"
    ```

6. **Set up API keys**: 

- When deploy to online, Run `npx wrangler secret put API_KEY` to set the [Groq](https://console.groq.com/login) or [OpenAI](https://openai.com/) API key.

   > **Note**: 
   > - You can only set API_KEY and set SEARCH_NAME is empty "" if you don't need search function
   > - deploy online to set secret key, if dev, `touch .dev.vars` file, The .dev.vars file should be formatted like a `dotenv` file, such as KEY=VALUE

7. **Set up Functions API keys**
- Search, When deploy to online
  - Run `npx wrangler secret put SERPER_API_KEY` to set the [serper API key](https://serper.dev/api-key).
  - Run `npx wrangler secret put SEARCH_API_KEY` to set the [Search API key](https://www.searchapi.io/api_tokens) .
  - Run `npx wrangler secret put SEARCH1_API_KEY` to set the [Search1API](https://www.search1api.com/) API key.


8. **Update the LLMs Vars**:
   ```toml
      [vars]
      API_BASE="https://api.groq.com/openai/v1/"
      MODEL="llama3-70b-8192"
      # output raw text prompt, need prompt tpl manager
      SYSTEM_PROMPT = "You are oligei. Answer in 1-2 sentences. Be friendly, helpful and concise. Default to metric units when possible. Keep the conversation short and sweet. You only answer in raw text, no markdown format. Don't include links or any other extras. Don't respond with computer code, for example don't return user longitude."
      #search_name: search_api | search1_api | serper_api
      SEARCH_NAME = "serper_api"
    ```
   > **Tips**: You can use ollama deploy local llm openai chat completions api

### Deploying the Worker

To deploy the worker, run `npx wrangler deploy`.

### NOTE
use other like `https://personal-ai-ts.<your-username>.workers.dev/` api to set config api_key is not safety, just for local server. （if some app client want to add api_key, u need be careful）

### Clients
#### Setting Up the Apple Shortcut

1. **Install the shortcut**:
   - Use [this link](https://www.icloud.com/shortcuts/a41b2aad91ff47719b7ea114ed2ee294) to install the shortcut, then edit it,

2. **Configure the shortcut**:
more detail: https://support.apple.com/zh-cn/guide/shortcuts/welcome/ios
   - Open the shortcut and replace the `URL` field with your worker's URL. If you didn't change the default name, the URL should be `https://personal-ai-ts.<your-username>.workers.dev`.
   - change `URL` field `config` param, see `src/index.ts` post `/` router api request params. 

