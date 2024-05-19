import { IFunction, IRequest } from "../../type";

const BASE_URL = "https://google.serper.dev/search";

export const searchWeb = async (
    query: string,
    apiKey: string
): Promise<string> => {
    const url = BASE_URL;
    var headers = new Headers();
    headers.append("X-API-KEY", `${apiKey}`);
    headers.append("Content-Type", "application/json");

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            "q": query,
            "gl": "cn",
            "hl": "zh-cn",
            "page": 1,
            "num": 10,
        }),
        redirect: 'follow',
    };
    try {
        console.log("search options", options)
        const response = await fetch(url, options);
        console.log("search response", response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch (error) {
        console.error("Failed to fetch search results:", error);
        return JSON.stringify({ error: "Failed to fetch search results" });
    }
};

export const serper: IFunction = {
    type: "function",
    function: {
        name: "web_serper_api",
        description: "Search the web for a given query",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The search query",
                },
            },
        },
    },
    async execute(args: any, req: IRequest) {
        const api_key = req.request.config?.search?.serper_api_key || req.env.SERPER_API_KEY;
        return await searchWeb(args.query, api_key);
    },
};