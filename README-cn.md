# personal-ai-ts

这是一个无需专用硬件设备即可与 Apple Shortcuts 等客户端协同工作的个人 AI 工具。来自：[fatwang2/siri-ultra](https://github.com/fatwang2/siri-ultra), [Sh4yy/personal-ai](https://github.com/Sh4yy/personal-ai) 和 [honojs/hono-minimal](https://github.com/honojs/hono-minimal)。

## 工作原理

助手运行在 Cloudflare Workers 上，可以与任何 LLM 模型配合工作。

### 入门指南

1. **克隆仓库**：
   - 克隆此仓库并导航到根目录。

2. **安装依赖**：
   - 运行 `npm install` 以安装必要的依赖。

3. **与 Cloudflare 进行身份验证**：
   - 运行 `npx wrangler login` 以登录到您的 Cloudflare 帐户。

4. **创建 KV 命名空间**：
   - 运行 `npx wrangler kv:namespace create chats` 以创建 KV 命名空间。记下 ID。

5. **配置项目**：
   - 更新 `wrangler.toml` 文件中的命名空间 ID：

   ```toml
      [[kv_namespaces]]
      binding = "siri_ai_chats"
      id = "<id>"
    ```

6. **设置 API 密钥**：

   - 部署到线上时，运行 `npx wrangler secret put API_KEY` 以设置 [Groq](https://console.groq.com/login) 或 [OpenAI](https://openai.com/) 的 API 密钥。

   > **注意**：
   > - 如果不需要搜索功能，设置 API_KEY; SEARCH_NAME 设置为空“”。
   > - 部署到线上设置密钥，如果在开发环境，创建 `.dev.vars` 文件，文件格式应类似 `dotenv` 文件，如 KEY=VALUE。

7. **设置 Functions API 密钥**
   - 部署到线上时搜索功能：
     - 运行 `npx wrangler secret put SERPER_API_KEY` 以设置 [serper API 密钥](https://serper.dev/api-key)。
     - 运行 `npx wrangler secret put SEARCH_API_KEY` 以设置 [Search API 密钥](https://www.searchapi.io/api_tokens)。
     - 运行 `npx wrangler secret put SEARCH1_API_KEY` 以设置 [Search1API](https://www.search1api.com/) API 密钥。

8. **更新 LLMs Vars**：
   ```toml
      [vars]
      API_BASE="https://api.groq.com/openai/v1/"
      MODEL="llama3-70b-8192"
      # output raw text prompt, need prompt tpl manager
      SYSTEM_PROMPT = "你是oligei。回答限制在1-5句话内。要友好、乐于助人且简明扼要。默认使用公制单位。保持对话简短而甜蜜。只用纯文本回答，不要包含链接或其他附加内容。不要回复计算机代码，例如不要返回用户的经度。请一定要使用中文回复"
      #search_name: search_api | search1_api | serper_api
      SEARCH_NAME = "serper_api"
    ```
   > **提示**：您可以使用 ollama 部署本地 llm openai chat completions api。

### 部署 Worker

运行 `npx wrangler deploy` 以部署 worker。

### 注意
使用其他如 `https://personal-ai-ts.<your-username>.workers.dev/` api 设置 config api_key 不安全，仅适用于本地服务器。（如果某些应用客户端需要添加 api_key，您需要谨慎）

## 客户端
### 设置 Apple Shortcut

1. **安装快捷指令**：
   - 可以使用 [此链接](https://search2ai.online/siri002) 安装快捷指令, 进行修改。

2. **配置快捷指令**：
更多详情： https://support.apple.com/zh-cn/guide/shortcuts/welcome/ios
   - 打开快捷指令并将 `URL` 字段替换为您的 worker URL。如果您未更改默认名称，URL 应为 `https://personal-ai-ts.<your-username>.workers.dev`。
   - 要配置 Apple Shortcut，以便将请求发送到 Cloudflare Worker，您需要更改 URL 字段中的 config 参数，以符合 src/index.ts 文件中的 POST / 路由 API 请求参数格式。
