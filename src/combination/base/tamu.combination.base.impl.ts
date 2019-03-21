import {TamuCombinationBase} from './tamu.combination.base';
import * as THREE from 'three';
import {TamuGeometry} from 'tamujs';

export class TamuCombinationBaseImpl implements TamuCombinationBase {
  public readonly width: number;
  public readonly height: number;
  public readonly materialData: any[] = [];

  constructor() {
  }


  public makeObjects(): Promise<THREE.Geometry> {
    return null;
  }

  public mergeGeometry(obj: THREE.Object3D): THREE.Geometry {
    let geo = new TamuGeometry();
    let index = 0;
    obj.traverse(child => {
      if (child instanceof THREE.Mesh) {
        geo.merge(new THREE.Geometry().fromBufferGeometry(<THREE.BufferGeometry>child.geometry), new THREE.Matrix4(), index);
        index++;
      }
    });
    return geo;
  }
}
