import { pipe, S, N, F } from "@mobily/ts-belt";
import { match } from "ts-pattern";

export const parseCountToNumberByZeroToFive = (value: string) => 
  pipe(
    value,
    S.replaceByRe(/zero|ZERO/g, '0'),
    S.replaceByRe(/one|ONE/g, '1'),
    S.replaceByRe(/two|TWO/g, '2'),
    S.replaceByRe(/three|THREE/g, '3'),
    S.replaceByRe(/four|FOUR/g, '4'),
    S.replaceByRe(/five|FIVE/g, '5'),
  );

export const parseCountToNumberBySixToNine = (value: string) =>
  pipe(
    value,
    S.replaceByRe(/six|SIX/g, '6'),
    S.replaceByRe(/seven|SEVEN/g, '7'),
    S.replaceByRe(/eight|EIGHT/g, '8'),
    S.replaceByRe(/nine|NINE/g, '9'),
  );

export const parseStringToNumber = (value: string) => 
  pipe(
    value,
    S.replaceByRe(/[^0-9]/g, ''),
    (v) => match(v.length)
      .when(N.lte(1), () => `${v}${v}`)
      .when(N.gte(3), () => `${v.at(0)}${v.at(-1)}`)
      .otherwise(F.always(v)),
  )