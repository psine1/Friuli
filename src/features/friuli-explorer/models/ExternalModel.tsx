import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
export function ExternalModel({url}:{url:string}){const {scene}=useGLTF(url);const model=useMemo(()=>scene.clone(true),[scene]);return <primitive object={model}/>}
