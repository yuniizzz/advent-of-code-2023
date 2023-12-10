import { pipe, S } from '@mobily/ts-belt';

export const parseStringToDigit = (value: string) =>
  S.replaceByRe(value, /[^0-9]/g, '');

export const parseDigitLogicAndNumber = (value: string) =>
  pipe(value, parseStringToDigit, (v) => `${v.at(0)}${v.at(-1)}`, Number);

export const parseCountToDigit = (value: string) =>
  pipe(
    value,
    S.replaceByRe(/one|ONE/g, 'one1one'),
    S.replaceByRe(/two|TWO/g, 'two2two'),
    S.replaceByRe(/three|THREE/g, 'three3three'),
    S.replaceByRe(/four|FOUR/g, 'four4four'),
    S.replaceByRe(/five|FIVE/g, 'five5five'),
    S.replaceByRe(/six|SIX/g, 'six6six'),
    S.replaceByRe(/seven|SEVEN/g, 'seven7seven'),
    S.replaceByRe(/eight|EIGHT/g, 'eight8eight'),
    S.replaceByRe(/nine|NINE/g, 'nine9nine'),
  );
