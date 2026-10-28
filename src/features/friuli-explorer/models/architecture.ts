import {
  BoxGeometry, BufferGeometry, CylinderGeometry, Euler, ExtrudeGeometry,
  Float32BufferAttribute, Matrix4, Path, Quaternion, Shape, SphereGeometry, TorusGeometry, Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type Triple = [number, number, number];
export const palette = {
  plaster: '#e5d7bd', stone: '#e5dcca', trim: '#b3ad99', rose: '#c49a8a',
  brick: '#ae765b', roof: '#a16147', roofDark: '#865240', glass: '#354b4a',
  wood: '#645344', bronze: '#4d655b', gold: '#c7a153', blue: '#405774',
  paving: '#cbbca1', pavingLight: '#e1d3b9', grass: '#a4b285',
  leaf: '#7f956a', leafDark: '#627f60', earth: '#b99a77', ochre: '#d5b889',
} as const;
export type Finish = keyof typeof palette;
export interface Batch { finish: Finish; geometry: BufferGeometry }

/** Build once, merge by finish: detail adds triangles rather than draw calls. */
export class Architecture {
  private parts = new Map<Finish, BufferGeometry[]>();

  add(geometry: BufferGeometry, finish: Finish, position: Triple = [0, 0, 0],
      rotation: Triple = [0, 0, 0], scale: Triple = [1, 1, 1]) {
    geometry.applyMatrix4(new Matrix4().compose(new Vector3(...position),
      new Quaternion().setFromEuler(new Euler(...rotation)), new Vector3(...scale)));
    // All primitives need the same attribute layout before merging.
    geometry.deleteAttribute('uv');
    const flat = geometry.index ? geometry.toNonIndexed() : geometry;
    if (flat !== geometry) geometry.dispose();
    const group = this.parts.get(finish) ?? [];
    group.push(flat);
    this.parts.set(finish, group);
  }

  box(position: Triple, size: Triple, finish: Finish = 'stone', rotation: Triple = [0, 0, 0]) {
    this.add(new BoxGeometry(...size), finish, position, rotation);
  }

  cylinder(position: Triple, radius: number, height: number, finish: Finish = 'stone',
           topRadius = radius, sides = 12) {
    this.add(new CylinderGeometry(topRadius, radius, height, sides), finish, position);
  }

  sphere(position: Triple, radius: number, finish: Finish, scale: Triple = [1, 1, 1]) {
    this.add(new SphereGeometry(radius, 8, 6), finish, position, [0, 0, 0], scale);
  }

  ring(position: Triple, radius: number, thickness: number, finish: Finish,
       scale: Triple = [1, 1, 1]) {
    this.add(new TorusGeometry(radius, thickness, 5, 32), finish, position, [0, 0, 0], scale);
  }

  panel(points: [number, number][], depth: number, position: Triple, finish: Finish,
        holes: Path[] = [], rotation: Triple = [0, 0, 0]) {
    const shape = new Shape();
    points.forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y));
    shape.closePath();
    shape.holes.push(...holes);
    this.add(new ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 10 }),
      finish, position, rotation);
  }

  /** An actual open arch/spandrel, without a wall or opaque plane behind it. */
  arch(x: number, spring: number, z: number, width: number, rise: number,
       depth: number, finish: Finish = 'stone', pointed = false) {
    const r = width / 2, t = .085;
    const shape = new Shape();
    shape.moveTo(-r - t, 0);
    shape.lineTo(-r - t, rise + t);
    shape.lineTo(r + t, rise + t);
    shape.lineTo(r + t, 0);
    shape.lineTo(r, 0);
    if (pointed) {
      shape.quadraticCurveTo(r * .82, rise * .68, 0, rise);
      shape.quadraticCurveTo(-r * .82, rise * .68, -r, 0);
    } else {
      shape.absellipse(0, 0, r, rise, 0, Math.PI, false, 0);
    }
    shape.closePath();
    this.add(new ExtrudeGeometry(shape, {depth, bevelEnabled: false, curveSegments: 10}),
      finish, [x, spring, z]);
  }

  column(x: number, z: number, bottom: number, height: number, radius = .085,
         finish: Finish = 'stone') {
    this.cylinder([x, bottom + height / 2, z], radius, height, finish);
    this.box([x, bottom + .04, z], [radius * 2.9, .08, radius * 2.9], finish);
    this.cylinder([x, bottom + height - .06, z], radius * 1.6, .12, finish);
    this.box([x, bottom + height, z], [radius * 3, .07, radius * 3], finish);
  }

  window(x: number, y: number, z: number, width: number, height: number,
         trim: Finish = 'trim') {
    this.box([x, y, z], [width, height, .035], 'glass');
    this.box([x - width / 2 - .025, y, z + .02], [.05, height + .1, .07], trim);
    this.box([x + width / 2 + .025, y, z + .02], [.05, height + .1, .07], trim);
    this.box([x, y - height / 2 - .025, z + .03], [width + .16, .055, .12], trim);
    this.box([x, y + height / 2 + .025, z + .02], [width + .12, .055, .08], trim);
  }

  /** Hipped roof with a long ridge, unlike the former stretched pyramid. */
  roof(position: Triple, width: number, depth: number, rise: number, finish: Finish = 'roof') {
    const w = width / 2, d = depth / 2, ridge = Math.max(0, w - d * .65);
    const points = [ [-w,0,-d], [w,0,-d], [w,0,d], [-w,0,d],
      [-ridge,rise,0], [ridge,rise,0] ];
    const faces = [0,4,5, 0,5,1, 1,5,2, 2,5,4, 2,4,3, 3,4,0, 0,1,2, 0,2,3];
    const geometry = new BufferGeometry();
    // Roof vertices are intentionally shared only by face.
    const vertices = new Float32Array(faces.flatMap(i => points[i]));
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    this.add(geometry, finish, position);
  }

  stairs(x: number, z: number, width: number, count: number, rise: number, tread: number,
         bottom = 0, finish: Finish = 'stone') {
    for (let i = 0; i < count; i++) {
      const h = (count - i) * rise;
      this.box([x, bottom + h / 2, z + i * tread], [width, h, tread + .01], finish);
    }
  }

  finish(): Batch[] {
    const batches: Batch[] = [];
    for (const [finish, parts] of this.parts) {
      const geometry = mergeGeometries(parts, false);
      if (!geometry) throw new Error(`Cannot merge architectural geometry: ${finish}`);
      parts.forEach(part => part.dispose());
      geometry.computeBoundingSphere();
      batches.push({ finish, geometry });
    }
    this.parts.clear();
    return batches;
  }
}

export function rectangleHole(x: number, y: number, width: number, height: number) {
  const path = new Path();
  path.moveTo(x - width / 2, y);
  path.lineTo(x - width / 2, y + height);
  path.lineTo(x + width / 2, y + height);
  path.lineTo(x + width / 2, y);
  path.closePath();
  return path;
}

export function roundHole(x: number, y: number, radius: number) {
  const path = new Path();
  path.absarc(x, y, radius, 0, Math.PI * 2, true);
  return path;
}
