import {TamuCombinationBaseImpl} from './base/tamu.combination.base.impl';
import * as THREE from 'three';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';

export class XuanzhuanCombination extends TamuCombinationBaseImpl {

  constructor() {
    super();
  }

  public makeObjects(option?): Promise<THREE.Geometry> {
    return new Promise<THREE.Geometry>(resolve => {
      this.width = option.width * 2;
      this.height = option.height * 2;
      resolve(this.makeGeometry(option, new THREE.Shape([
        new THREE.Vector2(-this.width / 2, -this.height / 2),
        new THREE.Vector2(this.width / 2, -this.height / 2),
        new THREE.Vector2(this.width / 2, this.height / 2),
        new THREE.Vector2(-this.width / 2, this.height / 2),
      ])));
    });
  }

  public makeGeometry(data: { width: number, height: number, subsection: number, angle: number }, shape: THREE.Shape): THREE.Geometry {
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

  public makeVertices(data: { width: number, height: number }, start: THREE.Vector2, size: THREE.Vector2, num?: THREE.Vector2): [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][] {
    let pf = [];
    let count;
    if (num) {
      count = num.y;
    }
    let change = true;
    let change1 = true;
    for (let i = start.x - data.width; i <= start.x + size.x; i += data.width) {
      for (let j = start.y - data.height; j <= start.y + size.y; j += data.height) {
        if (num && num.x === 0) return <any>pf;
        if (num && count === 0) continue;
        if (change) {
          if (change1) {
            pf.push([
              new THREE.Vector3(i + data.width, j, 0),
              new THREE.Vector3(i + data.width, j + data.height, 0),
              new THREE.Vector3(i, j + data.height, 0),
              new THREE.Vector3(i, j, 0),
            ]);
          } else {
            pf.push([
              new THREE.Vector3(i, j, 0),
              new THREE.Vector3(i + data.width, j, 0),
              new THREE.Vector3(i + data.width, j + data.height, 0),
              new THREE.Vector3(i, j + data.height, 0),
            ]);
          }
        } else {
          if (change1) {
            pf.push([
              new THREE.Vector3(i + data.width, j + data.height, 0),
              new THREE.Vector3(i, j + data.height, 0),
              new THREE.Vector3(i, j, 0),
              new THREE.Vector3(i + data.width, j, 0),
            ]);
          } else {
            pf.push([
              new THREE.Vector3(i, j + data.height, 0),
              new THREE.Vector3(i, j, 0),
              new THREE.Vector3(i + data.width, j, 0),
              new THREE.Vector3(i + data.width, j + data.height, 0),
            ]);
          }
        }
        change1 = !change1;
        if (num) {
          count--;
          num.x--;
        }
        if (num && num.x === 0) return <any>pf;
        if (num && count === 0) continue;
      }
      if (num) count = num.y;
      change = !change;
      change1 = true;
    }
    return <any>pf;
  }
}
