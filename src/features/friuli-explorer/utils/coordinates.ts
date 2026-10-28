import type { Place } from '../types';
export function geographicToScene(coordinates:Place['coordinates'],origin={latitude:46.0632,longitude:13.235}):[number,number,number]{const north=(coordinates.latitude-origin.latitude)*111320;const east=(coordinates.longitude-origin.longitude)*111320*Math.cos(origin.latitude*Math.PI/180);return [east/30,0.18,-north/30]}
export function positionFor(place:Place){return place.scenePosition??geographicToScene(place.coordinates)}
