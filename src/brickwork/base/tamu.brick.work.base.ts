import * as THREE from 'three';
export interface TamuBrickWorkBase {
  makeObjects(isAnimate?: boolean): {obj: THREE.Object3D, positions: THREE.Vector3[]};
}
