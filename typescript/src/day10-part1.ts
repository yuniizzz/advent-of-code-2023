/**
 * You use the hang glider to ride the hot air from Desert Island all the way up to the floating metal island. This island is surprisingly cold and there definitely aren't any thermals to glide on, so you leave your hang glider behind.

You wander around for a while, but you don't find any people or animals. However, you do occasionally find signposts labeled "Hot Springs" pointing in a seemingly consistent direction; maybe you can find someone at the hot springs and ask them where the desert-machine parts are made.

The landscape here is alien; even the flowers and trees are made of metal. As you stop to admire some metal grass, you notice something metallic scurry away in your peripheral vision and jump into a big pipe! It didn't look like any animal you've ever seen; if you want a better look, you'll need to get ahead of it.

Scanning the area, you discover that the entire field you're standing on is densely packed with pipes; it was hard to tell at first because they're the same metallic silver color as the "ground". You make a quick sketch of all of the surface pipes you can see (your puzzle input).

The pipes are arranged in a two-dimensional grid of tiles:

| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
Based on the acoustics of the animal's scurrying, you're confident the pipe that contains the animal is one large, continuous loop.

For example, here is a square loop of pipe:

.....
.F-7.
.|.|.
.L-J.
.....
If the animal had entered this loop in the northwest corner, the sketch would instead look like this:

.....
.S-7.
.|.|.
.L-J.
.....
In the above diagram, the S tile is still a 90-degree F bend: you can tell because of how the adjacent pipes connect to it.

Unfortunately, there are also many pipes that aren't connected to the loop! This sketch shows the same loop as above:

-L|F7
7S-7|
L|7||
-L-J|
L|-JF
In the above diagram, you can still figure out which pipes form the main loop: they're the ones connected to S, pipes those pipes connect to, pipes those pipes connect to, and so on. Every pipe in the main loop connects to its two neighbors (including S, which will have exactly two pipes connecting to it, and which is assumed to connect back to those two pipes).

Here is a sketch that contains a slightly more complex main loop:

..F7.
.FJ|.
SJ.L7
|F--J
LJ...
Here's the same example sketch with the extra, non-main-loop pipe tiles also shown:

7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
If you want to get out ahead of the animal, you should find the tile in the loop that is farthest from the starting position. Because the animal is in the pipe, it doesn't make sense to measure this by direct distance. Instead, you need to find the tile that would take the longest number of steps along the loop to reach from the starting point - regardless of which way around the loop the animal went.

In the first example with the square loop:

.....
.S-7.
.|.|.
.L-J.
.....
You can count the distance each tile in the loop is from the starting point like this:

.....
.012.
.1.3.
.234.
.....
In this example, the farthest point from the start is 4 steps away.

Here's the more complex loop again:

..F7.
.FJ|.
SJ.L7
|F--J
LJ...
Here are the distances for each tile on that loop:

..45.
.236.
01.78
14567
23...
Find the single giant loop starting at S. How many steps along the loop does it take to get from the starting position to the point farthest from the starting position?
 */

import { A, F, N, O, S, flow, pipe } from '@mobily/ts-belt';
import { P, match } from 'ts-pattern';

const input = `..F7.\n.FJ|.\nSJ.L7\n|F--J\nLJ...`;

// 1. S 의 위치 찾기
// 2. S에서 연결된 파이프들의 거리 구하기
// 3. 가장 먼 거리 구하기

const Signs = ['F', 'J', '7', 'L', 'S', '.', '|', '-'] as const;
const MovableSigns = ['F', 'J', '7', 'L', 'S', '|', '-'] as const;
const MovePoints = [0, 1] as const;

type MovePoint = (typeof MovePoints)[number];
type East = MovePoint;
type West = MovePoint;
type South = MovePoint;
type North = MovePoint;
type SignToOrder = [East, West, South, North];
type BinaryTreeIndex = [number, number];
type Sign = (typeof Signs)[number];
type MovableSign = (typeof MovableSigns)[number];

const findLoopStart = (input: string) => {
  const parseLoop = pipe(
    input,
    S.split('\n'),
    A.map(S.split('')),
  ) as ReadonlyArray<ReadonlyArray<Sign>>;
  console.log('parseLoop', parseLoop);
  const findStartPoint = pipe(
    parseLoop,
    A.getIndexBy(A.includes('S')),
    O.map<number, BinaryTreeIndex>((index) => [
      index,
      parseLoop[index].indexOf('S'),
    ]),
    O.getWithDefault<BinaryTreeIndex>([0, 0]),
  );
  console.log('findStartPoint', findStartPoint);

  const FindByIndex = ([x, y]: BinaryTreeIndex): O.Option<Sign> =>
    pipe(parseLoop, A.get(x), O.flatMap(A.get(y)));
  const MatchMovableSign = (sign: Sign) =>
    match(sign)
      .returnType<MovePoint>()
      .with(P.union(...MovableSigns), F.always(1))
      .otherwise(F.always(0));
  const SearchBinaryTree = ([x, y]: BinaryTreeIndex): SignToOrder => {
    const SearchByIndex = ([x, y]: BinaryTreeIndex): MovePoint =>
      pipe(FindByIndex([x, y]), O.match(MatchMovableSign, F.always(0)));
    return [
      SearchByIndex([x, y + 1]),
      SearchByIndex([x, y - 1]),
      SearchByIndex([x + 1, y]),
      SearchByIndex([x - 1, y]),
    ];
  };
  const MatchSignToOrder = (sign: Sign) =>
    match(sign)
      .returnType<SignToOrder>()
      .with('F', () => [1, 0, 1, 0])
      .with('J', () => [0, 1, 0, 1])
      .with('7', () => [0, 1, 1, 0])
      .with('L', () => [1, 0, 0, 1])
      .with('S', () => SearchBinaryTree(findStartPoint))
      .with('|', () => [0, 0, 1, 1])
      .with('-', () => [1, 1, 0, 0])
      .with('.', () => [0, 0, 0, 0])
      .exhaustive();

  const LoopSignToOrder = pipe(parseLoop, A.map(A.map(MatchSignToOrder)));
  console.log('LoopSignToOrder', LoopSignToOrder);

  const mine = pipe(parseLoop, A.map(A.map(() => 0)));
  const a = [
    ...pipe(
      mine,
      A.map((v) => [...v]),
    ),
  ];
  const loop =
    (acc: number) =>
    ([x, y]: BinaryTreeIndex) => {
      const r1 = ([x, y]: BinaryTreeIndex) =>
        pipe([x, y], FindByIndex, O.map(MatchSignToOrder));
      const r = (cur: number) => (signToOrder: SignToOrder) =>
        match(signToOrder)
          .returnType<boolean>()
          .with([1, 0, 1, 0], () => {
            /** searh east, south */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 1, 0, 1], () => {
            /** west, north */
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 1, 1, 0], () => {
            /** west, south */
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([1, 0, 0, 1], () => {
            /** east, north */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 0, 1, 1], () => {
            /** south, north */
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([1, 1, 0, 0], () => {
            /** east, west */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([1, 1, 1, 0], () => {
            /** east, west, south */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([1, 1, 0, 1], () => {
            /** east, west, north */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 1, 1, 1], () => {
            /** west, south, north */
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([1, 0, 1, 1], () => {
            /** east, south, north */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([1, 1, 1, 1], () => {
            /** east, west, south, north */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 0, 0, 1], () => {
            /** north */
            pipe(r1([x + 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 0, 1, 0], () => {
            /** south */
            pipe(r1([x - 1, y]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 1, 0, 0], () => {
            /** west */
            pipe(r1([x, y - 1]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([1, 0, 0, 0], () => {
            /** east */
            pipe(r1([x, y + 1]), O.flatMap(r(cur)));
            a[x][y] = cur + 1;
            return true;
          })
          .with([0, 0, 0, 0], () => {
            /** none */
            a[x][y] = cur + 1;
            return false;
          })
          .exhaustive();
      return pipe(LoopSignToOrder, A.get(x), O.flatMap(A.get(y)), O.map(r(0)));
    };
  loop(0)(findStartPoint);
  console.log('a', a);
};

findLoopStart(input);
