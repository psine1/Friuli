import { Architecture, type Batch } from './architecture';

export function buildCastello(): Batch[] {
  const a = new Architecture();
  a.box([0, .08, 0], [8.3, .16, 4.1], 'trim');
  a.box([0, 2, 0], [7.9, 3.8, 3.45], 'plaster');
  // Continuous horizontal cornices and regular window bays on both elevations.
  for (const y of [.85, 2.14, 2.75, 3.9]) {
    a.box([0, y, 0], [8.04, .065, 3.58], 'trim');
  }
  for (const direction of [-1, 1]) {
    const z = direction * 1.75;
    const rows: [number, number][] = [[1.48, .65], [2.46, .37], [3.3, .5]];
    for (const x of [-3.55, -2.95, -2.35, -1.75, -1.15, 1.15, 1.75, 2.35, 2.95, 3.55]) {
      for (const [y, height] of rows) {
        // Reverse each window group so its reveal faces outward.
        const temporary = new Architecture();
        temporary.window(0, y, 0, .24, height);
        for (const batch of temporary.finish()) {
          a.add(batch.geometry, batch.finish, [x, 0, z], [0, direction === 1 ? 0 : Math.PI, 0]);
        }
      }
    }
    for (const x of [-.75, .75]) {
      a.ring([x, 3.32, z + direction * .015], .17, .035, 'trim', [1.35, .8, 1]);
      a.sphere([x, 3.32, z], .17, 'glass', [1.3, .75, .08]);
    }
  }
  // South entrance; the distinctive double stair belongs to the NORTH courtyard.
  a.window(0, 1.05, 1.78, .5, 1.25, 'trim');
  a.box([0, .82, 1.81], [.43, 1.25, .04], 'wood');
  a.stairs(0, 1.9, 1.1, 4, .055, .15);
  a.box([0, 1.55, -1.79], [.5, 1.1, .08], 'wood');
  a.box([0, 2.16, -1.8], [.8, .12, .16], 'trim');
  // Four flights fold into a central landing, with parapets following each flight.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 12; i++) {
      const x = side * (.25 + i * .12);
      const y = .13 + i * .085;
      a.box([x, y / 2, -2.28], [.13, y, .7], 'trim');
      a.column(x, -2.65, y, .28, .025, 'stone');
      a.box([x, y + .32, -2.65], [.16, .05, .07], 'stone');
      const secondX = side * (1.65 - i * .12);
      const secondY = 1.08 + i * .075;
      a.box([secondX, secondY / 2, -1.91], [.13, secondY, .44], 'trim');
      a.column(secondX, -2.15, secondY, .28, .025, 'stone');
      a.box([secondX, secondY + .32, -2.15], [.16, .05, .07], 'stone');
    }
  }
  // Central vaulted entrance under the stair landing.
  a.arch(0, .48, -2.7, .58, .3, .13, 'stone');
  a.box([0, 1.03, -2.42], [.65, .16, .55], 'trim');
  a.box([0, .35, -2.18], [.48, .7, .04], 'wood');
  a.roof([0, 3.94, 0], 8.3, 3.85, .65, 'roofDark');
  // Guardiafogo: restrained lookout rising from the roof, not a fantasy turret.
  a.box([2.65, 4.52, -.25], [.56, .9, .58], 'plaster');
  a.box([2.65, 5, -.25], [.7, .1, .7], 'trim');
  a.box([2.65, 4.72, .05], [.17, .27, .035], 'glass');
  const batches = a.finish();
  // Keep the long palace proportions; do not turn the central bays into a tower.
  batches.forEach(({ geometry }) => geometry.scale(1.05, .78, 1));
  return batches;
}
