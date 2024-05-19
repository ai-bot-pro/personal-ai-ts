import { Hono } from "hono";
import { handle } from "./chat";
import { IBody } from "./type";
import { ChatHistory } from "./history";
//import { env } from 'node:process'
//console.log("process_env", env);

const app = new Hono();

app.post("/", async (c) => {
  const body = (await c.req.json()) as IBody;
  try {
    console.log("body", JSON.stringify(body, null, 2));
    console.log("env", c.env);
    const response = await handle({
      env: c.env,
      request: body,
    });

    return c.json({
      response,
    });
  } catch (error) {
    console.log(error);
    return c.json({
      response: "响应出错了:(",
    });
  }
});

app.post("/history/del", async (c) => {
  const body = (await c.req.json()) as IBody;
  try {
    console.log(JSON.stringify(body, null, 2));
    const chat = ChatHistory.getInstance(c.env.siri_ai_chats);
    await chat.remove(body.chat_id);
    return c.json({
      response: "ok",
    });
  } catch (error) {
    console.log(error);
    return c.json({
      response: "响应出错了:(",
    });
  }
});

export default app;
