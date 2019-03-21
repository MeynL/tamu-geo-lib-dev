import * as THREE from 'three';

export interface TamuCombinationBase {

  makeObjects(): Promise<THREE.Geometry>;
}
