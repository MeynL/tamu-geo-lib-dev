import {TamuCombinationBaseImpl} from './base/tamu.combination.base.impl';
import * as THREE from 'three';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';

export class DiamondCombination extends TamuCombinationBaseImpl {

  constructor() {
    super();
  }

  public makeObjects(option?: any): Promise<THREE.Geometry> {
    return new Promise<THREE.Geometry>(resolve => {
      this.width = (option.height * 2) / Math.sqrt(2);
      this.height = (option.width * 2) / Math.sqrt(2);
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
    let next = true;
    let count;
    // num = new THREE.Vector2(1, 1);
    if (num) {
      count = num.y;
    }
    for (let i = start.x - data.width; i <= start.x + size.x + data.width + data.width; i += (data.height / Math.sqrt(2))) {
      for (let j = start.y - data.height; j <= start.y + size.y + data.height; j += (data.width * Math.sqrt(2))) {
        let center = new THREE.Vector3((i + i + data.width) / 2, (j + j + data.height) / 2, 0);
        if (num && num.x === 0) return <any>pf;
        if (num && count === 0) continue;
        if (next) {
          // 正常
          // let xy1 = FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, 1 * Math.PI / 4);
          // let xy2 = FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, 1 * Math.PI / 4);
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, 1 * Math.PI / 4),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, 1 * Math.PI / 4),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, 1 * Math.PI / 4),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, 1 * Math.PI / 4),
          ]);
          if (num) {
            count--;
            num.x--;
          }
          if (num && num.x === 0) return <any>pf;
          if (num && count === 0) continue;
        } else {
          // 错位
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, -Math.PI / 4).add(new THREE.Vector3(0, -data.width * Math.sqrt(2) / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, -Math.PI / 4).add(new THREE.Vector3(0, -data.width * Math.sqrt(2) / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, -Math.PI / 4).add(new THREE.Vector3(0, -data.width * Math.sqrt(2) / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, -Math.PI / 4).add(new THREE.Vector3(0, -data.width * Math.sqrt(2) / 2, 0)),
          ]);
          if (num) {
            count--;
            num.x--;
          }
          if (num && num.x === 0) return <any>pf;
          if (num && count === 0) continue;
        }
      }
      if (num) count = num.y;
      next = !next;
    }
    return <any>pf;
  }
}
