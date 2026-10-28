/** Scene configuration is local to Udine; future towns need separate scene configurations. */
export const udineScene = {
  id: 'udine',
  origin: { latitude: 46.0632, longitude: 13.235 },
  overview: { position: [25, 26, 31], target: [0, 1, -2] },
  hill: { center: [0, -9], height: 2.4, radii: [7.2, 5.9], plateau: .6 },
} as const;

export function groundHeight(x: number, z: number): number {
  const { center, height, radii, plateau } = udineScene.hill;
  const radius = Math.sqrt(((x - center[0]) / radii[0]) ** 2 + ((z - center[1]) / radii[1]) ** 2);
  const t = Math.max(0, Math.min(1, (radius - plateau) / (1 - plateau)));
  return .06 + height * (1 - t * t * (3 - 2 * t));
}
