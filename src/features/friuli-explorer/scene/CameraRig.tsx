import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PerspectiveCamera, Vector3 } from 'three';
import type { Place } from '../types';
import { positionFor } from '../utils/coordinates';
import { udineScene } from '../data/sceneConfig';

export function CameraRig({ selected, reduced, viewRevision }: {
  selected: Place | null; reduced: boolean; viewRevision: number;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, invalidate, size } = useThree();
  const moving = useRef(false);
  const goal = useRef(new Vector3());
  const look = useRef(new Vector3());

  useEffect(() => {
    const compact = size.width <= 700;
    const base = selected ? new Vector3(...positionFor(selected)) : new Vector3();
    const target = selected?.camera?.targetOffset ?? [0, 1.5, 0];
    look.current.copy(selected ? base.clone().add(new Vector3(...target)) : new Vector3(...udineScene.overview.target));
    const offset = selected?.camera?.offset ?? [9, 7, 12];
    goal.current.copy(selected
      ? base.add(new Vector3(...offset).multiplyScalar(compact ? Math.max(1.35, size.height / size.width * .82) : 1))
      : new Vector3(...udineScene.overview.position).multiplyScalar(compact ? 1.65 : 1));
    if (camera instanceof PerspectiveCamera) {
      // Reserve lower screen space for the mobile information sheet.
      camera.setViewOffset(size.width, size.height, 0, compact && selected ? size.height * .13 : 0, size.width, size.height);
      camera.updateProjectionMatrix();
    }
    moving.current = true;
    invalidate();
  }, [selected, reduced, invalidate, viewRevision, camera, size.width, size.height]);

  useFrame((_, dt) => {
    if (!moving.current || !controls.current) return;
    const step = reduced ? 1 : 1 - Math.exp(-Math.min(dt, .1) * 4.5);
    camera.position.lerp(goal.current, step);
    controls.current.target.lerp(look.current, step);
    controls.current.update();
    if (camera.position.distanceTo(goal.current) < .015 && controls.current.target.distanceTo(look.current) < .015) {
      camera.position.copy(goal.current);
      controls.current.target.copy(look.current);
      controls.current.update();
      moving.current = false;
    } else invalidate();
  });

  return <OrbitControls ref={controls} makeDefault minDistance={8.5} maxDistance={90}
    minPolarAngle={.2} maxPolarAngle={1.15} enablePan={false}
    onStart={() => { moving.current = false; }} />;
}
