import { A, AR, F, N, O, S, flow, pipe } from "@mobily/ts-belt";
import { fetchInput } from "./fetch";
import { P, match } from "ts-pattern";
import { personalLaptop } from "./auth";

const filterStringAndSum = (value: string) => {
  const parseStringToNumber = (value: string) => {
    return pipe(
      value,
      S.replaceByRe(/[^0-9]/g, ''),
      (v) => match(v.length)
        .when(N.lte(1), () => `${v}${v}`)
        .when(N.gte(3), () => `${v.at(0)}${v.at(-1)}`)
        .otherwise(F.always(v)),
    )
  };

  return pipe(
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
}

const fetchInputByPersonalSession = fetchInput(personalLaptop);

const coo = await pipe(
  fetchInputByPersonalSession(1),
  AR.map(filterStringAndSum),
).then(v => v._0);
console.log('coo', coo);

// console.log('coo', await fetchInput(personalLaptop)(1));