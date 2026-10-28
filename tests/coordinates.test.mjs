import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geographicToScene, positionFor } from '../src/features/friuli-explorer/utils/coordinates.ts';
test('local projection preserves origin and north/east direction',()=>{
 const origin={latitude:46,longitude:13};
 const center=geographicToScene(origin,origin);
 assert.deepEqual(center,[0,.18,-0]);
 const east=geographicToScene({latitude:46,longitude:13.001},origin);
 const north=geographicToScene({latitude:46.001,longitude:13},origin);
 assert.ok(east[0]>2 && east[0]<3);
 assert.ok(Math.abs(north[2]+111.32/30)<.000001);
});
test('art direction overrides projection without changing coordinates',()=>{
 const place={coordinates:{latitude:46,longitude:13},scenePosition:[2,3,4]};
 const before=JSON.stringify(place.coordinates);
 assert.deepEqual(positionFor(place),[2,3,4]);
 assert.equal(JSON.stringify(place.coordinates),before);
});
