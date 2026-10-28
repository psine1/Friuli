import { Architecture, type Batch } from './architecture';

export function clock(a: Architecture, x: number, y: number, z: number, radius: number,
                      face: 'blue' | 'bronze' = 'blue') {
  a.sphere([x, y, z], radius, 'stone', [1, 1, .04]);
  a.sphere([x, y, z + .02], radius * .75, face, [1, 1, .04]);
  a.ring([x, y, z + .035], radius, .025, 'trim');
  a.ring([x, y, z + .045], radius * .76, .017, 'gold');
  // Twenty-four markers evoke the historic dial without a raster texture/font download.
  for (let i = 0; i < 24; i++) {
    const angle = i * Math.PI / 12;
    a.box([x + Math.sin(angle) * radius * .88, y + Math.cos(angle) * radius * .88, z + .05],
      [.018, radius * .13, .02], 'wood', [0, 0, -angle]);
  }
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6;
    a.box([x + Math.sin(angle) * radius * .27, y + Math.cos(angle) * radius * .27, z + .07],
      [.018, radius * .29, .02], 'gold', [0, 0, -angle]);
  }
  a.sphere([x, y, z + .08], radius * .16, 'gold', [1, 1, .12]);
  a.box([x, y + radius * .22, z + .09], [.022, radius * .48, .025], 'wood');
  a.box([x + radius * .15, y, z + .09], [radius * .32, .025, .025], 'wood');
}

function bellStriker(a: Architecture, x: number, y: number, z: number, mirror: number) {
  a.sphere([x, y + .4, z], .085, 'bronze');
  a.cylinder([x, y + .22, z], .09, .25, 'bronze', .065);
  a.box([x - .045, y + .04, z], [.045, .2, .06], 'bronze');
  a.box([x + .045, y + .04, z], [.045, .2, .06], 'bronze');
  a.box([x + mirror * .13, y + .24, z], [.24, .035, .04], 'bronze', [0, 0, mirror * .3]);
  a.box([x + mirror * .22, y + .26, z], [.025, .27, .025], 'wood', [0, 0, mirror * .65]);
  a.box([x + mirror * .29, y + .36, z], [.12, .045, .05], 'bronze');
}

export function buildSanGiovanni(): Batch[] {
  const a = new Architecture();
  a.box([0, .13, 0], [10, .26, 1.85], 'stone');
  a.stairs(0, 1, 10, 4, .065, .13);
  // Central triumphal arch and seven smaller bays to either side.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 8; i++) a.column(side * (1.12 + i * .51), .65, .26, 1.25, .055);
    for (let i = 0; i < 7; i++) {
      a.arch(side * (1.12 + (i + .5) * .51), 1.51, .54, .4, .25, .18, 'stone');
    }
    a.box([side * 2.96, 1.9, 0], [3.92, .16, 1.6], 'stone');
    a.roof([side * 3, 1.99, -.05], 4.02, 1.7, .24);
    a.box([side * 2.96, 1.02, -.68], [3.9, 1.55, .12], 'plaster');
    for (let j = 0; j < 4; j++) a.window(side * (1.5 + j * .87), .95, -.59, .24, .55);
  }
  for (const x of [-1.02, 1.02]) {
    a.box([x, 1.35, .53], [.23, 2.2, .3], 'stone');
    a.column(x, .81, .4, 1.87, .1);
  }
  a.arch(0, 2.26, .47, 1.82, .91, .32, 'stone');
  a.box([0, 3.28, .12], [2.5, .18, 1.2], 'stone');
  a.box([0, 1.43, -.49], [2, 2.4, .19], 'plaster');
  a.window(0, .88, -.36, .5, 1.1, 'stone');
  a.box([0, .8, -.32], [.43, 1.05, .03], 'wood');
  a.arch(0, 2.01, -.33, .9, .42, .035, 'trim');
  // The clock tower rises behind the LEFT side of the central arch, as in the reference.
  const tx = -1.65;
  a.box([tx, 3.03, -.27], [1.44, 2.1, 1.1], 'stone');
  for (const y of [2.6, 2.9, 3.2]) a.box([tx, y, .3], [1.4, .025, .02], 'trim');
  a.box([tx, 3.9, -.25], [1.7, .16, 1.35], 'trim');
  a.box([tx, 4.72, -.25], [1.43, 1.5, 1.12], 'stone');
  a.box([tx, 4.72, .32], [1.18, 1.28, .035], 'trim');
  clock(a, tx, 4.72, .365, .55);
  for (const dx of [-.66, .66]) a.column(tx + dx, .36, 4.02, 1.42, .045, 'stone');
  a.box([tx, 5.54, -.25], [1.72, .16, 1.4], 'stone');
  a.box([tx, 5.67, -.25], [1.83, .09, 1.5], 'trim');
  a.cylinder([tx, 5.86, -.1], .13, .27, 'bronze', .075);
  bellStriker(a, tx - .53, 5.77, -.1, 1);
  bellStriker(a, tx + .53, 5.77, -.1, -1);
  return a.finish();
}
