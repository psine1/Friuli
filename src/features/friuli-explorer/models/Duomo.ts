import { Architecture, roundHole, type Batch } from './architecture';

function rose(a: Architecture, x: number, y: number, z: number, radius: number) {
  a.ring([x, y, z], radius, .055, 'stone');
  a.ring([x, y, z + .025], radius * .85, .025, 'trim');
  a.sphere([x, y, z - .055], radius * .89, 'glass', [1, 1, .025]);
  a.box([x, y, z + .025], [radius * 1.72, .025, .035], 'trim');
  a.box([x, y, z + .025], [.025, radius * 1.72, .035], 'trim');
}

export function buildDuomo(): Batch[] {
  const a = new Architecture();
  a.box([0, .1, 0], [5.9, .2, 6.4], 'stone');
  a.stairs(0, 3.3, 5.9, 4, .05, .15);
  // Central nave, lower side aisles, transept and octagonal unfinished campanile.
  a.box([0, 1.85, -.15], [2.3, 3.4, 5.7], 'brick');
  a.roof([0, 3.56, -.15], 2.5, 5.9, .68);
  for (const side of [-1, 1]) {
    a.box([side * 1.88, 1.2, -.15], [1.45, 2.1, 5.65], 'plaster');
    a.roof([side * 1.85, 2.28, -.15], 1.75, 5.9, .36);
  }
  a.box([0, 1.6, -1.8], [6.15, 2.8, 1.3], 'brick');
  a.cylinder([0, 1.4, -3], 1.2, 2.5, 'brick', 1.2, 8);
  // Stepped gable profile and actual circular openings in the brick front wall.
  const outline: [number, number][] = [
    [-2.85, 0], [2.85, 0], [2.85, 1.55], [2.05, 1.88], [2.05, 2.95],
    [.78, 3.5], [.78, 4.14], [0, 4.45], [-.78, 4.14], [-.78, 3.5],
    [-2.05, 2.95], [-2.05, 1.88], [-2.85, 1.55],
  ];
  a.panel(outline, .18, [0, .2, 2.8], 'brick',
    [roundHole(0, 3.36, .47), roundHole(-1.36, 2.44, .235), roundHole(1.36, 2.44, .235)]);
  // Four separate strips preserve the circular aperture and dark glazing.
  for (const x of [-.55, .55]) a.box([x, 3.56, 3.005], [.065, 1.16, .055], 'stone');
  for (const y of [3.01, 4.11]) a.box([0, y, 3.005], [1.16, .065, .055], 'stone');
  rose(a, 0, 3.56, 3.075, .47);
  for (const x of [-1.36, 1.36]) rose(a, x, 2.64, 3.025, .235);
  // Three portals, the central portal's projecting Gothic surround and canopy.
  for (const x of [-1.37, 0, 1.37]) {
    const center = x === 0;
    const w = center ? .61 : .43, h = center ? .91 : .7;
    a.box([x, .2 + h / 2, 3.04], [w, h, .045], 'wood');
    for (const dx of [-w / 2 - .06, w / 2 + .06]) a.column(x + dx, 3.1, .2, h, .04);
    a.arch(x, .2 + h, 3.055, w + .06, center ? .47 : .27, .12, 'stone', true);
  }
  a.panel([[-.52, 1.18], [0, 1.76], [.52, 1.18]], .34, [0, .2, 2.98], 'stone');
  a.panel([[-.43, 1.2], [0, 1.65], [.43, 1.2]], .03, [0, .2, 3.33], 'brick');
  // Tall side lancets and the distinctive blind arcade between the lower round windows.
  for (const x of [-1.36, 1.36]) {
    a.window(x, 1.58, 3.01, .22, 1.08, 'stone');
    a.arch(x, 2.12, 3.03, .25, .21, .055, 'stone', true);
  }
  for (let i = 0; i < 9; i++) {
    const x = -1.06 + i * .265;
    a.column(x, 3.02, 2.3, .36, .019, 'trim');
    a.arch(x + .12, 2.66, 3.01, .2, .13, .045, 'trim', true);
  }
  for (let i = 0; i < 7; i++) {
    const x = -.67 + i * .22, y = 4.35 - Math.abs(x) * .4;
    a.arch(x, y - .2, 3, .16, .17, .06, 'stone', true);
  }
  const tx = -3.35, tz = -1.45;
  a.cylinder([tx, 1.98, tz], 1.08, 3.6, 'trim', 1.08, 8);
  for (const y of [.28, 1.15, 2.14, 3.77]) a.cylinder([tx, y, tz], 1.13, .09, 'stone', 1.13, 8);
  a.cylinder([tx, 3.98, tz], .9, .33, 'trim', .9, 8);
  // Low tiled cap only: the planned spire was never completed.
  a.cylinder([tx, 4.2, tz], 1.02, .16, 'roofDark', .88, 8);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    a.box([tx + Math.sin(angle) * 1.01, 3.18, tz + Math.cos(angle) * 1.01],
      [.2, .45, .05], 'glass', [0, angle, 0]);
  }
  return a.finish();
}
