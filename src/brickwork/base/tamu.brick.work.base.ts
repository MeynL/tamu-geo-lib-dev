import * as THREE from 'three';
export interface TamuBrickWorkBase {
  makeObjects(): {obj: THREE.Object3D, positions: THREE.Vector3[]};
}
