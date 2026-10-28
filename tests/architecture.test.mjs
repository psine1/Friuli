import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { DoubleSide, Mesh, MeshBasicMaterial, Raycaster, Vector3, Box3 } from 'three';

// Compile the pure geometry builders for Node; no browser or WebGL is needed.
const testsRoot = dirname(fileURLToPath(import.meta.url));
const generated = await mkdtemp(join(testsRoot, '.architecture-'));
await writeFile(join(generated, 'package.json'), '{"type":"module"}');
for (const name of ['architecture', 'Castello', 'Lionello', 'SanGiovanni', 'Duomo', 'CityDestinations']) {
  const source = await readFile(new URL(`../src/features/friuli-explorer/models/${name}.ts`, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
    .replace(/from '(\.\/[^']+)'/g, (_, path) => `from '${path.endsWith('.js') ? path : `${path}.js`}'`);
  await writeFile(join(generated, `${name}.js`), output);
}
after(async () => {
  const target = resolve(generated);
  assert.ok(target.startsWith(resolve(testsRoot) + sep));
  await rm(target, { recursive: true });
});
const load = name => import(pathToFileURL(join(generated, `${name}.js`)).href);
const { buildCastello } = await load('Castello');
const { buildLionello } = await load('Lionello');
const { buildSanGiovanni } = await load('SanGiovanni');
const { buildDuomo } = await load('Duomo');
const { buildSanGiacomo, buildLippomano } = await load('CityDestinations');

function shoot(batches, origin, direction) {
  const material = new MeshBasicMaterial({ side: DoubleSide });
  const meshes = batches.map(({ geometry }) => new Mesh(geometry, material));
  meshes.forEach(mesh => mesh.updateMatrixWorld());
  const hits = new Raycaster(new Vector3(...origin), new Vector3(...direction)).intersectObjects(meshes);
  material.dispose();
  return hits;
}

for (const [name, build] of Object.entries({ castle: buildCastello, lionello: buildLionello,
  sanGiovanni: buildSanGiovanni, duomo: buildDuomo, sanGiacomo: buildSanGiacomo, lippomano: buildLippomano })) {
  test(`${name}: finite geometry and bounded static draw/triangle budget`, () => {
    const batches = build();
    assert.ok(batches.length <= 12, 'at most twelve material batches per monument');
    const triangles = batches.reduce((n, batch) => n + batch.geometry.attributes.position.count / 3, 0);
    assert.ok(triangles < 30000, `${triangles} triangles exceeds the monument budget`);
    for (const { geometry } of batches) {
      const bounds = new Box3().setFromBufferAttribute(geometry.attributes.position);
      assert.ok([...bounds.min.toArray(), ...bounds.max.toArray()].every(Number.isFinite));
      geometry.dispose();
    }
  });
}
test('Lionello ground-floor arcade and upper lancets have real open front apertures', () => {
  const batches = buildLionello();
  for (const point of [[0, 1, 5], [-1.8, 3, 5]]) {
    const hits = shoot(batches, point, [0, 0, -1]);
    assert.ok(hits.length > 0, 'rear wall should remain behind the aperture');
    assert.ok(hits[0].point.z < 0, 'front opening must not be filled by a box or window decal');
  }
  batches.forEach(({ geometry }) => geometry.dispose());
});
test('San Giovanni side portico lets rays reach its recessed rear wall', () => {
  const batches = buildSanGiovanni();
  const hits = shoot(batches, [3.415, 1, 4], [0, 0, -1]);
  assert.ok(hits.length > 0);
  assert.ok(hits[0].point.z < 0, 'arcade is blocked at its front plane');
  batches.forEach(({ geometry }) => geometry.dispose());
});
