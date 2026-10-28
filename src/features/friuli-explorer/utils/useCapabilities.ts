import { useSyncExternalStore } from 'react';
let available:boolean|undefined;
const noSubscribe=()=>()=>{};
function webglSnapshot(){if(available===undefined){const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2');available=Boolean(context);context?.getExtension('WEBGL_lose_context')?.loseContext()}return available}
function motionSubscribe(callback:()=>void){const media=matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback)}
export function useCapabilities(){const webgl=useSyncExternalStore(noSubscribe,webglSnapshot,()=>null);const reduced=useSyncExternalStore(motionSubscribe,()=>matchMedia('(prefers-reduced-motion: reduce)').matches,()=>false);return {webgl,reduced}}
