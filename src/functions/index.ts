import { IFunction, IRequest } from "../type";
import { getFunction as getSearchFunc } from "./search/api";


const getFunctions = (req?: IRequest): IFunction[] => {
  let functions: IFunction[] = [];
  if (req == undefined) {
    return functions;
  }

  // add search func
  const search_func = getSearchFunc(req);
  if (search_func == undefined) {
    return functions;
  }
  functions.push(search_func);

  console.log("init functions", functions)
  return functions;
};

const getFunction = (
  name: string,
  functions: IFunction[],
): IFunction => {
  const func = functions.find((f) => f.function.name === name);
  return func;
}

const handle = async (
  name: string,
  args: any,
  req: IRequest,
  functions: IFunction[],
): Promise<string> => {
  const func = getFunction(name, functions);
  if (!func) return "";
  return func.execute(args, req);
};


export const FunctionHandler = {
  getFunctions,
  handle,
};