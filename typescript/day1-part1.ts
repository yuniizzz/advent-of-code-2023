import { A, AR, O, S, flow, pipe } from "@mobily/ts-belt";
import { fetchInput } from "./fetch";
import { P, match } from "ts-pattern";
import { personalLaptop } from "./auth";
import { parseStringToNumber } from "./utils/StringToNumber";

const filterStringAndSum = (value: string) => 
  pipe(
    value,
    S.splitByRe(/\n/),
    A.map(O.map(flow(parseStringToNumber, Number))),
    A.reduce(0, (acc, curr) => 
      match<[number, O.Option<number>], number>([acc, curr])
        .with([P._, P.nullish], ([a]) => a)
        .with([P._, P.not(P.nullish)], ([a, b]) => a + b)
        .exhaustive(),
    ),
  );
  
const fetchInputByPersonalSession = fetchInput(personalLaptop);

const answer = pipe(
  fetchInputByPersonalSession(1),
  AR.map(filterStringAndSum),
).then(v => v._0);

console.log(await answer);
