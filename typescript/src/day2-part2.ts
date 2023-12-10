import { A, AR, B, F, N, O, S, flow, pipe } from '@mobily/ts-belt';
import { P, match } from 'ts-pattern';
import { parseStringToDigit } from './utils/StringToNumber';
import { fetchInputByPersonalSession } from './fetch';

type CubeColor = 'red' | 'green' | 'blue';

const filterString = (game: string) => {
  console.log('-------------------');
  console.log('game', game);
  const parseGame = pipe(game, S.split(':'));

  const parseStringToNumber = (value: string) =>
    pipe(value, parseStringToDigit, Number);
  const parseGameSet = pipe(parseGame, A.last, O.map(S.split(';')));
  console.log('parseGameSet', parseGameSet);

  const parseGameSetFlat = pipe(
    parseGameSet,
    O.map(A.map(S.split(','))),
    O.map(A.deepFlat),
  );
  console.log('parseGameSetFlat', parseGameSetFlat);

  const filterCubeColor = (cubeColor: CubeColor) =>
    pipe(
      parseGameSetFlat,
      O.map(flow(A.filter(S.includes(cubeColor)), A.map(parseStringToNumber))),
    );

  const cubeMaxCountByCubeColor = (cubeColor: CubeColor) =>
    pipe(
      cubeColor,
      filterCubeColor,
      O.map(A.reduce(0, (acc, v) => (v > acc ? v : acc))),
    );

  const cubeSet = [
    cubeMaxCountByCubeColor('red'),
    cubeMaxCountByCubeColor('green'),
    cubeMaxCountByCubeColor('blue'),
  ] as const;

  console.log('cubeSet', cubeSet);

  return match(cubeSet)
    .with(
      [P.not(P.nullish), P.not(P.nullish), P.not(P.nullish)],
      ([red, green, blue]) => red * green * blue,
    )
    .otherwise(() => 0);
};

// const t = filterString(
//   'Game 1: 1 green, 1 blue, 1 red; 3 green, 1 blue, 1 red; 4 green, 3 blue, 1 red; 4 green, 2 blue, 1 red; 3 blue, 3 green',
// );
// console.log('t', t);

const answer = pipe(
  fetchInputByPersonalSession(2),
  AR.map(flow(S.split('\n'), A.map(filterString), A.reduce(0, N.add))),
).then((v) => v._0);

console.log(await answer);
