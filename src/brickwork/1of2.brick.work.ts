import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import * as THREE from 'three';

export class Oo2BrickWork implements TamuBrickWorkBase {
  private animationUtil: AnimationBase;
  constructor() {}

  makeObject(data: any, size: THREE.Vector2): THREE.Object3D {
    return undefined;
  }

  makeObjects(data: any, size: THREE.Vector2, isAnimate?: boolean): { objs: THREE.Object3D[]; positions: THREE.Vector3[] } {
    return undefined;
  }

  makeVertices(data: any, size: THREE.Vector2): THREE.Vector2[] {
    return undefined;
  }
}
