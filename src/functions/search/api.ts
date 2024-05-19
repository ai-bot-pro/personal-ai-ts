import { IFunction, IRequest, ISearch } from "../../type";
import { serper } from "./serper_api";
import { search1 } from "./search1_api";
import { search } from "./search_api";

const registedSearchFunctions = new Map<string, IFunction>([
    ["serper_api", serper],
    ["search_api", search],
    ["search1_api", search1],
]);

export const getFunction = (req?: IRequest): IFunction => {
    if (req == undefined) {
        return undefined;
    }
    const search_name = req.request.config?.search?.search_name || req.env.SEARCH_NAME;
    let func = registedSearchFunctions.get(search_name);
    console.log(`${search_name} get search function`, func);
    return func;
};

