import type { ThreeElements } from '@react-three/fiber';
import type { Landmark } from '../types';
import { ArchitecturalMesh } from './ArchitecturalMesh';
import { buildCastello } from './Castello';
import { buildLionello } from './Lionello';
import { buildDuomo } from './Duomo';
import { buildSanGiovanni } from './SanGiovanni';
import { buildLippomano, buildSanGiacomo } from './CityDestinations';

const builders = {
  castle: buildCastello, loggia: buildLionello, duomo: buildDuomo,
  'san-giovanni': buildSanGiovanni, 'san-giacomo': buildSanGiacomo, lippomano: buildLippomano,
} satisfies Record<Landmark, () => ReturnType<typeof buildCastello>>;

export function Monument({ kind, ...props }: { kind: Landmark } & ThreeElements['group']) {
  return <ArchitecturalMesh build={builders[kind]} {...props} />;
}
