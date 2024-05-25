import { IRequest, IChatBot } from "../type";
import { ChatHistory } from "../history";
import { AuthAccessToken } from "./access_token";

export class QianfanChatBot implements IChatBot {
    protected auth_key = "qianfan_auth_key";
    protected auth_key_ttl = 86400;

    protected async initAuth(req: IRequest): Promise<{ model: string, access_token: string }> {
        const qianfan = req.request.config?.qianfan;
        const model = qianfan?.model || req.env.QIANFAN_MODEL || "ernie-speed-128k";
        let access_token = ""

        const auth_token_instance = AuthAccessToken.getInstance(req.env.ai_bots);
        access_token = await auth_token_instance.get(this.auth_key);
        if (access_token) {
            return { model, access_token };
        }

        //https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application
        const ak = qianfan?.api_key || req.env.QIANFAN_API_KEY;
        const sk = qianfan?.secret_key || req.env.QIANFAN_SECRET_KEY;
        const url = `https://aip.baidubce.com/oauth/2.0/token`;
        const options = {
            method: "GET",
            params: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: ak,
                client_secret: sk,
            }),
            headers: {
                'Accept': 'application/json'
            }
        };
        const get_url = `${url}?${options.params}`;
        const response = await fetch(get_url);
        if (!response.ok) {
            throw new Error(`oauth error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(get_url, "auth_response:", data);
        if (data["error"] != undefined && data["error"] != 0) {
            throw new Error(`auth api return error: ${data["error_msg"]}`);
        }
        access_token = data["access_token"];

        auth_token_instance.add(this.auth_key, access_token, this.auth_key_ttl);

        return { model, access_token };
    };

    public async chat(req: IRequest, chat: ChatHistory, system: string): Promise<string> {
        const qianfan = await this.initAuth(req);
        let response = "";
        // TIPS: qianfan api very good... need KISS? :) see openai api style and cookbook, learn more MaaS;
        // MaaS for dev user, don't to choose more the same model api style. 
        const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${qianfan.model}?access_token=${qianfan.access_token}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "system": system,
                "messages": [
                    ...(await chat.get(req.request.chat_id)),
                ],
            })
        };
        const resp = await fetch(url, options);
        if (!resp.ok) {
            throw new Error(`HTTP chat error! status: ${resp.status}`);
        }
        const ask = await resp.json();
        console.log(url, "ask_response:", ask);
        // https://cloud.baidu.com/doc/WENXINWORKSHOP/s/tlmyncueh
        if (ask["error_code"] != undefined && ask["error_code"] != 0) {
            throw new Error(`chat api return error: ${ask["error_msg"]}`);
        }
        response = ask["result"];
        return response;
    }

    public async chatWithQianfanActions(req: IRequest, chat: ChatHistory, system: string): Promise<string> {
        const qianfan = await this.initAuth(req);
        let response = "";
        //@todo: use ernie-func-8k https://cloud.baidu.com/doc/WENXINWORKSHOP/s/5ltxyqupn
        return response;
    }

    public async chatWithFunctions(req: IRequest, chat: ChatHistory, system: string): Promise<string> {
        const qianfan = await this.initAuth(req);
        let response = "";
        //@todo: use ERNIE 3.5 models https://cloud.baidu.com/doc/WENXINWORKSHOP/s/jlil56u11
        return response;
    }
}

