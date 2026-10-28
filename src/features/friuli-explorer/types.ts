import type { CSSProperties } from 'react';
export type Landmark = 'castle' | 'loggia' | 'duomo' | 'san-giovanni' | 'san-giacomo' | 'lippomano';
export type SceneVector = [number, number, number];
export interface Place {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  coordinates: { latitude: number; longitude: number };
  scenePosition?: SceneVector;
  /** Artistic Y rotation in radians; independent of geographic coordinates. */
  sceneRotation?: number;
  /** World-axis offset relative to scenePosition. */
  markerOffset?: SceneVector;
  /** Offsets relative to scenePosition, independent of model rotation. */
  camera?: { offset: SceneVector; targetOffset?: SceneVector };
  model: Landmark;
  sourceUrl: string;
  modelPath?: string;
}
export interface FriuliExplorerProps {places?:Place[];initialPlaceId?:string;assetBasePath?:string;className?:string;style?:CSSProperties;onPlaceSelect?:(place:Place|null)=>void;onPlaceOpen?:(place:Place)=>void;}
