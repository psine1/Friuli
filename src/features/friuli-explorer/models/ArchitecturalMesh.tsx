import { useEffect, useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import { palette, type Batch } from './architecture';

export function ArchitecturalMesh({ build, ...props }: { build: () => Batch[] } & ThreeElements['group']) {
  const batches = useMemo(() => build(), [build]);
  useEffect(() => () => batches.forEach(batch => batch.geometry.dispose()), [batches]);
  return <group {...props}>{batches.map(({ finish, geometry }) =>
    <mesh key={finish} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={palette[finish]} roughness={finish === 'gold' ? .5 : .9}
        metalness={finish === 'gold' || finish === 'bronze' ? .25 : 0} />
    </mesh>)}
  </group>;
}
