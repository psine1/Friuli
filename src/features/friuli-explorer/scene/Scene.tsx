'use client';
import { Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ExternalModel } from '../models/ExternalModel';
import { Landscape } from '../models/Landscape';
import { Monument } from '../models/Monument';
import { CameraRig } from './CameraRig';
import { positionFor } from '../utils/coordinates';
import type { Place } from '../types';
import styles from '../FriuliExplorer.module.css';

function Destination({ place, number, selected, anySelected, onSelect, assetBasePath }: {
  place: Place; number: number; selected: boolean; anySelected: boolean; onSelect: (place: Place) => void;
  assetBasePath: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();
  const marker = place.markerOffset ?? [0, 5, 0];
  return <group position={positionFor(place)}>
    <group rotation={[0, place.sceneRotation ?? 0, 0]}
      onClick={event => { event.stopPropagation(); onSelect(place); }}
      onPointerOver={event => { event.stopPropagation(); setHovered(true); gl.domElement.style.setProperty('cursor', 'pointer'); }}
      onPointerOut={() => { setHovered(false); gl.domElement.style.removeProperty('cursor'); }}>
      {place.modelPath ? <Suspense fallback={<Monument kind={place.model} />}>
        <ExternalModel url={`${assetBasePath.replace(/\/$/, '')}/${place.modelPath.replace(/^\//, '')}`} />
      </Suspense> : <Monument kind={place.model} />}
      {(hovered || selected) && <mesh position={[0, .03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.25, 64]} />
        <meshBasicMaterial color={selected ? '#a36346' : '#d6ab73'} transparent opacity={.7} depthWrite={false} />
      </mesh>}
    </group>
    <Html position={marker} center distanceFactor={32} zIndexRange={[8, 0]}
      style={{ display: !anySelected || selected ? 'block' : 'none' }}>
      <button className={`${styles.marker} ${selected ? styles.activeMarker : ''}`}
        onClick={() => onSelect(place)} aria-label={`Explorar ${place.name}`} aria-pressed={selected}>
        {String(number).padStart(2, '0')}
      </button>
    </Html>
  </group>;
}

export default function Scene({ places, selected, onSelect, reduced, assetBasePath, viewRevision }: {
  places: Place[]; selected: Place | null; onSelect: (place: Place) => void;
  reduced: boolean; assetBasePath: string; viewRevision: number;
}) {
  return <Canvas shadows frameloop="demand" dpr={[1, 1.5]}
    camera={{ position: [25, 26, 31], fov: 40, near: .1, far: 180 }}
    onCreated={({ gl }) => { gl.setClearColor('#e9e6da'); gl.toneMappingExposure = 1.05; }}>
    <ambientLight intensity={.5} />
    <hemisphereLight args={['#fff2d9', '#718267', 1.45]} />
    <directionalLight position={[-11, 23, 12]} intensity={2.65} castShadow
      shadow-mapSize={[1024, 1024]} shadow-camera-left={-21} shadow-camera-right={21}
      shadow-camera-top={22} shadow-camera-bottom={-22} shadow-camera-near={1} shadow-camera-far={65}
      shadow-normalBias={.025} shadow-bias={-.00015} shadow-radius={2} />
    <Landscape />
    {places.map((place, i) => <Destination key={place.id}
      place={place} assetBasePath={assetBasePath}
      number={i + 1} selected={selected?.id === place.id} anySelected={Boolean(selected)} onSelect={onSelect} />)}
    <CameraRig selected={selected} viewRevision={viewRevision} reduced={reduced} />
  </Canvas>;
}
