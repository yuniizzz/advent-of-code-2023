import { A, AR, N, S, pipe } from '@mobily/ts-belt';
import { fetchInputByPersonalSession } from './fetch';
import { parseDigitLogicAndNumber } from './utils/StringToNumber';

const filterStringAndSum = (value: string) =>
  pipe(
    value,
    S.split('\n'),
    A.map(parseDigitLogicAndNumber),
    A.reduce(0, N.add),
  );

const answer = pipe(
  fetchInputByPersonalSession(1),
  AR.map(filterStringAndSum),
).then((v) => v._0);

// eslint-disable-next-line functional/no-expression-statements
console.log(await answer);
