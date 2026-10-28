import { BufferGeometry, Float32BufferAttribute } from 'three';
import { Architecture, type Batch, type Finish } from './architecture';
import { ArchitecturalMesh } from './ArchitecturalMesh';
import { groundHeight } from '../data/sceneConfig';
import { fountain } from './CityDestinations';

function terrain() {
  const segments = 80, rings = 36;
  const vertices: number[] = [], indices: number[] = [];
  for (let r = 0; r <= rings; r++) for (let i = 0; i <= segments; i++) {
    const angle = i / segments * Math.PI * 2;
    const x = Math.cos(angle) * 14.2 * r / rings;
    const z = -1 + Math.sin(angle) * 16 * r / rings;
    vertices.push(x, groundHeight(x, z), z);
  }
  for (let r = 0; r < rings; r++) for (let i = 0; i < segments; i++) {
    const v = r * (segments + 1) + i;
    indices.push(v, v + 1, v + segments + 1, v + 1, v + segments + 2, v + segments + 1);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function road(a: Architecture, points: [number, number][], width: number) {
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, z1] = points[i], [x2, z2] = points[i + 1];
    const dx = x2 - x1, dz = z2 - z1, length = Math.hypot(dx, dz);
    const nx = -dz / length * width / 2, nz = dx / length * width / 2;
    const steps = Math.max(1, Math.ceil(length / .4));
    const vertices: number[] = [];
    for (let j = 0; j < steps; j++) {
      const p = j / steps, q = (j + 1) / steps;
      const corners = [
        [x1 + dx * p + nx, z1 + dz * p + nz], [x1 + dx * q + nx, z1 + dz * q + nz],
        [x1 + dx * q - nx, z1 + dz * q - nz], [x1 + dx * p - nx, z1 + dz * p - nz],
      ];
      for (const index of [0, 1, 2, 0, 2, 3]) {
        const [x, z] = corners[index];
        vertices.push(x, groundHeight(x, z) + .025, z);
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    a.add(geometry, 'paving');
  }
}

function house(width: number, height: number, depth: number, color: Finish, arcaded: boolean) {
  const h = new Architecture();
  if (arcaded) {
    h.box([0, .65, -depth / 2 + .2], [width, 1.3, .4], color);
    h.box([0, (height + 1.25) / 2, 0], [width, height - 1.25, depth], color);
    for (let i = 0; i <= 3; i++) h.column(-width / 2 + i * width / 3, depth / 2 - .08, .08, .77, .05);
    for (let i = 0; i < 3; i++) h.arch(-width / 2 + (i + .5) * width / 3, .85, depth / 2 - .17,
      width / 3 - .13, .27, .18, color);
  } else h.box([0, height / 2, 0], [width, height, depth], color);
  h.box([0, height - .08, 0], [width + .1, .08, depth + .1], 'stone');
  h.roof([0, height, 0], width + .25, depth + .25, .4, 'roof');
  for (const y of [1.63, 2.37].filter(y => y + .23 < height)) {
    for (let i = 0; i < 3; i++) {
      const x = -width * .32 + i * width * .32;
      h.window(x, y, depth / 2 + .015, .19, .35, 'stone');
      for (const sign of [-1, 1]) h.box([x + sign * .14, y, depth / 2 + .06], [.07, .35, .035], 'bronze');
    }
  }
  if (!arcaded) h.box([0, .35, depth / 2 + .02], [.23, .7, .04], 'wood');
  return h.finish();
}

function buildLandscape(): Batch[] {
  const a = new Architecture();
  a.cylinder([0, -.5, -1], 14.2, 1, 'earth', 14.2, 80);
  // The disk is stretched in Z along with its top terrain.
  const base = a.finish();
  const b = new Architecture();
  base.forEach(batch => b.add(batch.geometry, batch.finish, [0, 0, 0], [0, 0, 0], [1, 1, 16 / 14.2]));
  b.add(terrain(), 'grass');
  // Piazza Libertà links its two facing loggias; the raised terrace reads separately.
  b.box([0, .075, -1.55], [9.7, .045, 2.8], 'pavingLight');
  for (let i = 0; i < 12; i++) b.box([-4.5 + i * .8, .103, -1.5], [.018, .012, 2.7], 'paving');
  road(b, [[-5.5, 3.1], [-3.9, 2.9], [-4.5, -.4], [-4.8, -3]], 1.1);
  road(b, [[3.6, -1.5], [4, 1.5], [3, 4], [2.3, 7], [2.6, 11.8]], 1.25);
  road(b, [[-5, 5.8], [-3, 5.7], [0, 5.8], [2.8, 6.4]], .9);
  road(b, [[4.8, -3.7], [6.8, -4.3], [6.8, -7.5], [5.3, -10], [3.8, -11.5], [0, -11.7]], 1.1);
  road(b, [[-3.5, -6], [-4.6, -8], [-4.5, -10.5], [-3, -11.6]], .8);
  b.box([2.4, .11, 7], [2.8, .06, 5.9], 'pavingLight');
  fountain(b, 3.85, -1.4, .18);
  // Two civic columns on the terrace, simplified silhouettes rather than invented sculpture.
  for (const x of [-3.4, 2.4]) {
    b.box([x, .23, -1.5], [.4, .3, .4], 'stone');
    b.column(x, -1.5, .38, 1.3, .065, 'trim');
    b.box([x, 1.78, -1.5], [.25, .12, .25], 'stone');
  }
  // Deliberate street fronts and small courtyard wings; no ring of random houses.
  const plots: [number, number, number, number, number, boolean][] = [
    [-9.4,-3.3,2.0,2.8,.15,true], [-7.1,-3.1,1.8,2.5,.1,true],
    [-10.2,-.5,1.5,2.65,Math.PI/2,false], [-11.6,2.4,1.6,2.55,Math.PI/2,true],
    [-8.2,7.0,1.7,2.5,Math.PI,true], [-6.25,7,1.7,2.85,Math.PI,true],
    [-4.3,7.1,1.6,2.55,Math.PI,true], [-6.2,9.2,1.9,2.15,0,false],
    [-3.5,10.3,2.0,2.4,0,false], [-1.25,10.8,1.8,2.6,0,false],
    [10.0,-.2,1.9,2.7,-Math.PI/2,true], [10.2,2.2,2,2.5,-Math.PI/2,true],
    [10.8,5,1.8,2.2,-Math.PI/2,false], [9.6,10.1,1.8,2.6,Math.PI,false],
    [6.7,11.9,2,2.3,Math.PI,false], [8.8,-5.2,1.65,2.2,-Math.PI/2,false],
    [-8.4,-7.3,1.5,2.1,.3,false], [-6.3,-10.5,1.8,1.9,.2,false],
  ];
  const colors: Finish[] = ['plaster', 'ochre', 'rose'];
  plots.forEach(([x,z,w,h,rotation,arcaded], i) => {
    house(w, h, 1.5, colors[i % colors.length], arcaded).forEach(batch =>
      b.add(batch.geometry, batch.finish, [x, groundHeight(x,z), z], [0,rotation,0]));
  });
  // One enclosed courtyard behind the southern street front.
  b.box([-2, .09, 12.3], [3.8,.1,1.7], 'paving');
  for (const x of [-4.1,.1]) b.box([x,.6,12.3], [.2,1.1,2.2], 'plaster');
  // Restrained vegetation clusters around the hill, away from monument sightlines.
  const trees: [number, number, number][] = [
    [-4,-5.8,1], [-5.1,-7.8,1.1], [-4.8,-11.9,.9],[-2.8,-13.3,1],
    [2,-13.5,1.1],[4.5,-12,.9],[7,-10.8,1.1],[8.2,-8.6,.8],
    [-10,6,.65],[-10.2,8.5,.8],[-8,10,.65],[1,12,.7],[11.8,-2,.8],
    [10,-7,.8],[-10,-8,.7],[-11,-5,.8],
  ];
  trees.forEach(([x,z,size],i) => {
    const y = groundHeight(x,z);
    b.cylinder([x,y + size*.4,z],.045,size*.8,'wood',.035,6);
    b.sphere([x,y+size*1.05,z],size*.5,i%2?'leaf':'leafDark',[.85,1.25,.85]);
  });
  // Benches and unlit lanterns serve as scale cues, not visual clutter.
  for (const [x,z] of [[-5,4.5],[2.1,9],[1.5,-12.3]]) {
    const y = groundHeight(x,z);
    b.box([x,y+.23,z],[.75,.07,.24],'wood');
    b.box([x,y+.4,z-.13],[.75,.24,.04],'wood');
    for(const dx of [-.25,.25]) b.box([x+dx,y+.11,z],[.04,.22,.2],'bronze');
  }
  for (const [x,z] of [[-4.8,1],[3,3.5],[-5.2,6.2]]) {
    b.cylinder([x,.75,z],.025,1.5,'bronze',.025,6);
    b.box([x,1.58,z],[.16,.23,.16],'stone');
    b.roof([x,1.7,z],.23,.23,.1,'bronze');
  }
  return b.finish();
}

export function Landscape() { return <ArchitecturalMesh build={buildLandscape} />; }
