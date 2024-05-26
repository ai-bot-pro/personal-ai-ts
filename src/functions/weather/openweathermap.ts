import { IFunction, IRequest } from "../../type";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeather = async (
    apiKey: string,
    lon: number,
    lat: number,
    lang: string,
    units: string,
): Promise<string> => {
    const url = `${BASE_URL}?appid=${apiKey}&lat=${lat}&lon=${lon}&lang=${lang}&units=${units}`;
    try {
        const response = await fetch(url);
        console.log(url, `get response`, response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return JSON.stringify({ error: "Failed to fetch weather data" });
    }
};

export const openweathermap: IFunction = {
    type: "function",
    function: {
        name: "get_weather",
        description: "Get the current weather",
        parameters: {
            type: "object",
            properties: {
                longitude: {
                    type: "number",
                    description: "The longitude to get the weather for",
                },
                latitude: {
                    type: "number",
                    description: "The latitude to get the weather for",
                },
            },
        },
    },
    async execute(args: any, req: IRequest) {
        return await getWeather(
            req.env.OPENWEATHERMAP_API_KEY,
            args.longitude,
            args.latitude,
            req.request.location.lang || req.env.OPENWEATHERMAP_LANGUAGE,
            req.env.OPENWEATHERMAP_UNITS || "metric",
        );
    },
};