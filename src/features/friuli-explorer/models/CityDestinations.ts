import { Architecture, type Batch } from './architecture';
import { clock } from './SanGiovanni';

export function fountain(a: Architecture, x: number, z: number, bottom = .12) {
  a.cylinder([x, bottom, z], .83, .12, 'stone', .83, 24);
  a.cylinder([x, bottom + .1, z], .7, .1, 'stone', .7, 24);
  a.cylinder([x, bottom + .23, z], .58, .16, 'trim', .61, 24);
  a.cylinder([x, bottom + .33, z], .56, .02, 'blue', .56, 24);
  a.cylinder([x, bottom + .5, z], .16, .6, 'stone', .12);
  a.cylinder([x, bottom + .77, z], .22, .2, 'stone', .47, 24);
  a.cylinder([x, bottom + .88, z], .47, .045, 'trim', .47, 24);
  a.cylinder([x, bottom + 1, z], .09, .25, 'stone', .06);
  a.cylinder([x, bottom + 1.14, z], .12, .07, 'stone', .25, 20);
}

export function buildSanGiacomo(): Batch[] {
  const a = new Architecture();
  // Raised market square, fountain and Marian column form a distinct ensemble.
  a.box([0, .08, .4], [5.1, .16, 6.5], 'pavingLight');
  fountain(a, 0, 1.95, .21);
  a.cylinder([-1.7, .3, .65], .38, .3, 'stone', .38, 8);
  a.column(-1.7, .65, .45, 1.8, .075, 'trim');
  a.cylinder([-1.7, 2.43, .65], .095, .27, 'stone', .06);
  a.sphere([-1.7, 2.64, .65], .075, 'stone');
  // Church and attached chapel with an asymmetric clock/bell tower.
  a.box([0, 1.52, -1.52], [3.7, 2.7, 2.5], 'plaster');
  a.roof([0, 2.92, -1.52], 3.95, 2.65, .49);
  a.box([0, 1.55, -.22], [3.85, 2.75, .17], 'stone');
  for (const y of [.25, 1.5, 2.95]) a.box([0, y, -.08], [4, .13, .25], 'trim');
  for (const x of [-1.78, -.35, 1.75]) {
    a.box([x, 1.55, -.06], [.12, 2.7, .12], 'stone');
    a.box([x, 2.86, -.04], [.23, .11, .18], 'trim');
  }
  a.window(-.99, .75, -.08, .55, 1, 'trim');
  a.box([-.99, .72, -.015], [.48, .92, .04], 'wood');
  for (const x of [-1.58, -.42, .2, .9, 1.52]) {
    a.window(x, 2.2, -.07, .23, .7, 'trim');
    a.arch(x, 2.55, -.03, .25, .12, .09, 'stone');
  }
  a.box([-.99, 1.75, .12], [1.05, .09, .5], 'stone');
  for (let i = 0; i < 7; i++) a.column(-1.44 + i * .15, .34, 1.8, .25, .022);
  a.box([-.99, 2.12, .34], [1.05, .05, .08], 'trim');
  a.box([-.99, 3.4, -.3], [1.05, .85, .6], 'stone');
  clock(a, -.99, 3.4, .025, .36, 'bronze');
  a.box([-.99, 3.88, -.3], [1.2, .13, .8], 'trim');
  for (const x of [-1.48, -.99, -.5]) a.column(x, -.05, 3.95, .5, .048);
  for (const x of [-1.235, -.745]) a.arch(x, 4.45, -.13, .38, .19, .22, 'stone');
  a.cylinder([-.99, 4.23, -.27], .1, .27, 'bronze', .065);
  a.roof([-.99, 4.74, -.3], 1.45, 1.1, .18, 'bronze');
  for (const x of [-1.65, -.32]) a.ring([x, 3.13, .02], .16, .04, 'stone');
  for (let i = 0; i < 12; i++) a.column(i * .15, -.03, 3.02, .25, .021);
  a.box([.85, 3.32, -.03], [1.92, .05, .1], 'stone');
  return a.finish();
}

export function buildLippomano(): Batch[] {
  const a = new Architecture();
  // A shortened illustrated stretch of six ascending pointed bays.
  for (let i = 0; i < 6; i++) {
    const x = -2.25 + i * .9, y = i * .28;
    a.box([x, (y + .14) / 2, 0], [.92, y + .14, 1.25], 'paving');
    a.box([x, y + .55, -.59], [.92, 1.1, .13], 'earth');
    a.column(x - .45, .54, y + .14, 1.02, .07, 'stone');
    a.arch(x, y + 1.16, .44, .73, .48, .2, 'stone', true);
    a.box([x, y + 1.75, 0], [.92, .11, 1.4], 'trim');
    a.roof([x, y + 1.83, 0], .98, 1.54, .24);
    for (let j = 0; j < 3; j++) {
      const height = y + j * .093 + .12;
      a.box([x - .3 + j * .3, height / 2, 1.24], [.31, height, 1.05], 'pavingLight');
    }
  }
  a.column(2.7, .54, 1.54, 1.02, .07);
  return a.finish();
}
