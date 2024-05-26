import { IFunction, IRequest } from "../../type";
import { openweathermap } from "./openweathermap";

const registeredWeatherFunctions = new Map<string, IFunction>([
    ["openweathermap_api", openweathermap],
]);

export const getFunction = (req?: IRequest): IFunction => {
    if (req == undefined) {
        return undefined;
    }
    const name = req.request.config?.weather?.weather_name || req.env.WEATHER_NAME;
    let func = registeredWeatherFunctions.get(name);
    console.log(`${name} get weather function`, func);
    return func;
};

