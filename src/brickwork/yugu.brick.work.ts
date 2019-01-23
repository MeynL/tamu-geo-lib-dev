import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';
import * as THREE from 'three';

export class YuguBrickWork implements TamuBrickWorkBase {
  private animationUtil: AnimationBase;

  constructor() {
  }

  makeObject(data: { width: number, height: number, subsection: number, angle: number }, shape: THREE.Shape): THREE.Geometry {
    if (!data.angle) data.angle = 0;
    let geometry = new TamuFloorGeometry(shape);
    geometry.rotatePoly(data.angle);
    geometry.computeBoundingBox();
    let size = geometry.boundingBox.max.sub(geometry.boundingBox.min);
    let vertices = this.makeVertices(data, new THREE.Vector2(geometry.boundingBox.min.x, geometry.boundingBox.min.y), new THREE.Vector2(size.x, size.y));
    geometry.generateFaceUV(vertices, data.subsection);
    geometry.mergeVertices();
    geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-data.angle));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  }

  makeObjects(data: any, size: THREE.Vector2, isAnimate?: boolean): { objs: THREE.Object3D[]; materixes: THREE.Matrix4[] } {
    return undefined;
  }

  makeVertices(data: { width: number, height: number }, start: THREE.Vector2, size: THREE.Vector2): [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][] {
    let pf = [];
    let next = true;
    for (let i = start.x - data.width; i <= start.x + size.x; i += data.width) {
      for (let j = start.y - data.height - data.height / 2; j <= start.y + size.y; j += data.height) {
        if (next) {
          // 正常
          pf.push([
            new THREE.Vector3(i, j + data.height, 0),
            new THREE.Vector3(i, j, 0),
            new THREE.Vector3(i + data.width, j, 0),
            new THREE.Vector3(i + data.width, j + data.height, 0)
          ]);
        } else {
          // 错位
          pf.push([
            new THREE.Vector3(i, j + data.height * 3 / 2, 0),
            new THREE.Vector3(i, j + data.height / 2, 0),
            new THREE.Vector3(i + data.width, j + data.height / 2, 0),
            new THREE.Vector3(i + data.width, j + data.height * 3 / 2, 0)
          ]);
        }
      }
      next = !next;
    }
    return <any>pf;
  }

}
