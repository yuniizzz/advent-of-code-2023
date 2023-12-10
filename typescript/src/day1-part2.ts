import { A, AR, N, S, flow, pipe } from '@mobily/ts-belt';
import { fetchInputByPersonalSession } from './fetch';
import {
  parseCountToDigit,
  parseDigitLogicAndNumber,
} from './utils/StringToNumber';

const filterStringAndSum = (value: string) =>
  pipe(
    value,
    S.split('\n'),
    A.map(flow(parseCountToDigit, parseDigitLogicAndNumber)),
    A.reduce(0, N.add),
  );

const answer = pipe(
  fetchInputByPersonalSession(1),
  AR.map(filterStringAndSum),
).then((v) => v._0);

// eslint-disable-next-line functional/no-expression-statements
console.log(await answer);

// console.log('t1', filterStringAndSum('oneight'));
// console.log('t2', filterStringAndSum('twoneight'));
// console.log('t3', filterStringAndSum('twoneighthree'));
