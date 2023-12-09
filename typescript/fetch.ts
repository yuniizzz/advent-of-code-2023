import { AR, S, pipe } from '@mobily/ts-belt';

export const fetchInput = (session: string) => (day: number) =>
  pipe(
    fetch(`https://adventofcode.com/2023/day/${day}/input`, {
      headers: {
        cookie: `session=${session}`,
      },
    })
      .then((res) => res.text())
      .then(S.trim),
    AR.make,
  );
