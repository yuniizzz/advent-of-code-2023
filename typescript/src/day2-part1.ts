import { A, AR, B, F, N, O, S, flow, pipe } from '@mobily/ts-belt';
import { P, match } from 'ts-pattern';
import { parseStringToDigit } from './utils/StringToNumber';
import { fetchInputByPersonalSession } from './fetch';

const filterString = (game: string) => {
  console.log('-------------------');
  console.log('game', game);
  const parseGame = pipe(game, S.split(':'));

  const parseStringToNumber = (value: string) =>
    pipe(value, parseStringToDigit, Number);

  const satisfiesColorCount = (set: Readonly<string>) =>
    match(set)
      .when(S.includes('red'), flow(parseStringToNumber, N.lte(12)))
      .when(S.includes('green'), flow(parseStringToNumber, N.lte(13)))
      .when(S.includes('blue'), flow(parseStringToNumber, N.lte(14)))
      .otherwise(F.falsy);

  const parseGameSet = pipe(parseGame, A.last, O.map(S.split(';')));
  console.log('parseGameSet', parseGameSet);
  const parseGameSetInColor = pipe(parseGameSet, O.map(A.map(S.split(','))));
  console.log('parseGameSetInColor', parseGameSetInColor);
  const parseGameSetInColorCount = pipe(
    parseGameSetInColor,
    O.map(A.map(A.map(satisfiesColorCount))),
  );
  console.log('parseGameSetInColorCount', parseGameSetInColorCount);
  const parseGameSetFlat = pipe(parseGameSetInColorCount, O.map(A.deepFlat));
  console.log('parseGameSetFlat', parseGameSetFlat);
  const parseGameSetFlatPasser = pipe(
    parseGameSetFlat,
    O.map(A.every(F.identity)),
  );
  console.log('parseGameSetFlatPasser', parseGameSetFlatPasser);

  const parseGameNumber = pipe(
    parseGame,
    A.head,
    O.map(parseStringToNumber),
    O.getWithDefault(0),
  );
  console.log('parseGameNumber', parseGameNumber);

  return parseGameSetFlatPasser ? parseGameNumber : 0;
};

// filterString(
//   'Game 1: 1 green, 1 blue, 1 red; 3 green, 1 blue, 1 red; 4 green, 3 blue, 1 red; 4 green, 2 blue, 1 red; 3 blue, 3 green',
// );

const answer = pipe(
  fetchInputByPersonalSession(2),
  AR.map(flow(S.split('\n'), A.map(filterString), A.reduce(0, N.add))),
).then((v) => v._0);

console.log(await answer);
