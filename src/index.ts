import { Hono } from "hono";
import { handle } from "./chat";
import { IBody } from "./type";
import { ChatHistory } from "./history";
//import { env } from 'node:process'
//console.log("process_env", env);

const app = new Hono();

app.post("/", async (c) => {
  try {
    const body = (await c.req.json()) as IBody;
    console.log("body", JSON.stringify(body, null, 2));
    console.log("env", c.env);
    if (body.chat_id != undefined
      && body.chat_id.trim().length == 0) {
      return c.json({
        response: "need chat id",
      });
    }

    if (body.config?.chat?.api_key != undefined
      && body.config?.chat?.api_key.trim().length == 0) {
      return c.json({
        response: "need chat api_key",
      });
    }

    const response = await handle({
      env: c.env,
      request: body,
    });

    return c.json({
      response: response,
    });
  } catch (error) {
    console.log(error);
    return c.json({
      response: "inner error :(",
    });
  }
});

app.post("/history/del", async (c) => {
  const body = (await c.req.json()) as IBody;
  try {
    console.log(JSON.stringify(body, null, 2));
    const chat = ChatHistory.getInstance(c.env.ai_chats);
    await chat.remove(body.chat_id);
    return c.json({
      response: "ok",
    });
  } catch (error) {
    console.log(error);
    return c.json({
      response: "inner error :(",
    });
  }
});

app.post("/history/get", async (c) => {
  const body = (await c.req.json()) as IBody;
  try {
    console.log(JSON.stringify(body, null, 2));
    const chat = ChatHistory.getInstance(c.env.ai_chats);
    const records = await chat.get(body.chat_id);
    return c.json(records);
  } catch (error) {
    console.log(error);
    return c.json({
      response: "inner error :(",
    });
  }
});

export default app;
