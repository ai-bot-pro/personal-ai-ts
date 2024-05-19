import { IFunction, IRequest } from "../../type";

const BASE_URL = "https://www.searchapi.io/api/v1/search";

export const searchWeb = async (
    query: string,
    apiKey: string
): Promise<string> => {
    const url = BASE_URL;
    const options = {
        method: "GET",
        params: new URLSearchParams({
            "engine": "google",
            "api_key": apiKey,
            "q": query,
            "gl": "cn",
            "hl": "zh-cn",
            "page": "1",
            "num": "10",
        }),
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

export const search: IFunction = {
    type: "function",
    function: {
        name: "web_search_api",
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
        const api_key = req.request.config?.search?.search_api_key || req.env.SEARCH_API_KEY;
        return await searchWeb(args.query, api_key);
    },
};