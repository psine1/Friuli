import { Architecture, rectangleHole, type Batch } from './architecture';

function upperFacade(a: Architecture, width: number, centers: number[], depth: number) {
  const bottom = 2.19, height = 1.65;
  const windows = centers.map(x => ({ x, count: x === 0 ? 5 : 3, width: x === 0 ? 1.4 : .98 }));
  const holes = windows.map(window => rectangleHole(window.x, .3, window.width, 1.15));
  a.panel([[-width / 2, 0], [width / 2, 0], [width / 2, height], [-width / 2, height]],
    .15, [0, bottom, depth], 'stone', holes);
  // Stone bands stop at the real window apertures.
  for (let band = 0; band < 8; band++) {
    const y = band * .2;
    const exclusions = y + .14 > .3 && y < 1.45 ? windows : [];
    let cursor = -width / 2;
    for (const window of [...exclusions, { x: width / 2, width: 0, count: 0 }]) {
      const end = Math.min(width / 2, window.x - window.width / 2);
      if (end > cursor) a.box([(cursor + end) / 2, bottom + y + .07, depth + .16],
        [end - cursor, .14, .015], band % 2 ? 'stone' : 'rose');
      cursor = window.x + window.width / 2;
    }
  }
  for (const { x, count, width: opening } of windows) {
    // Triforas at the sides and a central pentafora; all have shared slender mullions.
    const step = opening / count;
    for (let j = 0; j < count; j++) {
      a.arch(x - opening / 2 + (j + .5) * step, bottom + 1.11, depth + .02,
        step - .055, .3, .17, 'stone', true);
    }
    for (let j = 0; j <= count; j++) {
      a.column(x - opening / 2 + j * step, depth + .12, bottom + .3, .82, .027);
    }
    a.box([x, bottom + .28, depth + .13], [opening + .13, .065, .22], 'trim');
  }
}

export function buildLionello(): Batch[] {
  const a = new Architecture();
  a.box([0, .18, 0], [5.9, .36, 2.9], 'stone');
  a.stairs(0, 1.52, 1.6, 4, .09, .15);
  // Three open sides and a closed rear wall, matching the photographed loggia.
  for (const z of [1.2]) {
    for (let i = 0; i <= 7; i++) a.column(-2.7 + i * 5.4 / 7, z, .36, 1.12, .065);
    for (let i = 0; i < 7; i++) {
      a.arch(-2.7 + (i + .5) * 5.4 / 7, 1.48, z - .08, .64, .52, .16, 'stone', true);
    }
  }
  a.box([0, 1.23, -1.22], [5.5, 1.75, .16], 'rose');
  // Side return arcades, rotated as a whole, also open to light.
  for (const x of [-2.7, 2.7]) {
    const side = new Architecture();
    for (let i = 1; i < 3; i++) side.column(-1.2 + i * .8, 0, .36, 1.12, .065);
    for (let i = 0; i < 3; i++) side.arch(-.8 + i * .8, 1.48, -.08, .65, .52, .16, 'stone', true);
    for (const batch of side.finish()) a.add(batch.geometry, batch.finish, [x, 0, 0], [0, Math.PI / 2, 0]);
  }
  // Checkerboard floor is geometry, visible through the colonnade.
  for (let x = 0; x < 12; x++) for (let z = 0; z < 5; z++) {
    a.box([-2.48 + x * .45, .371, -.9 + z * .45], [.45, .012, .45], (x + z) % 2 ? 'rose' : 'pavingLight');
  }
  a.box([0, 2.12, 0], [5.7, .18, 2.65], 'trim');
  upperFacade(a, 5.55, [-1.8, 0, 1.8], 1.2);
  const side = new Architecture();
  upperFacade(side, 2.55, [0], 0);
  for (const batch of side.finish()) {
    const clone = batch.geometry.clone();
    a.add(batch.geometry, batch.finish, [2.62, 0, 0], [0, Math.PI / 2, 0]);
    a.add(clone, batch.finish, [-2.62, 0, 0], [0, -Math.PI / 2, 0]);
  }
  a.box([0, 3.02, -1.22], [5.5, 1.65, .13], 'rose');
  // Central stone balcony and balustrade below the central trifora.
  a.box([0, 2.5, 1.52], [1.4, .1, .65], 'stone');
  for (let i = 0; i < 9; i++) a.column(-.62 + i * .155, 1.8, 2.54, .28, .025);
  a.box([0, 2.88, 1.8], [1.4, .055, .09], 'stone');
  a.box([0, 3.88, 0], [5.8, .12, 2.9], 'stone');
  a.roof([0, 3.97, 0], 5.95, 3.02, .5, 'roofDark');
  return a.finish();
}
