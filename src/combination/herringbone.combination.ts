import {TamuCombinationBaseImpl} from './base/tamu.combination.base.impl';
import * as THREE from 'three';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';

export class HerringboneCombination extends TamuCombinationBaseImpl {

  constructor() {
    super();
  }

  public makeObjects(option?: any): Promise<THREE.Geometry> {
    return new Promise<THREE.Geometry>(resolve => {
      let muip = Math.floor(option.height / option.width);
      this.width = option.height + (option.width * muip);
      this.height = option.height + (option.width * muip);
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
    let move = 0;
    let muip = Math.floor(data.height / data.width);
    let desm = data.height - (muip * data.width);
    let des = 0;
    let count;
    if (num) {
      count = num.y;
    }
    for (let i = start.x - (size.x * 2); i <= start.x + (size.x * 2); i += next ? (muip * data.width) : (data.height)) {
      for (let j = start.y - data.height; j <= start.y + size.y + data.height; j += data.width) {
        if (num && num.x === 0) return <any>pf;
        if (num && count === 0) continue;
        if (next) {
          // 正常
          pf.push([
            new THREE.Vector3(i + data.height + move, j + data.width - des, 0),
            new THREE.Vector3(i + move, j + data.width - des, 0),
            new THREE.Vector3(i + move, j - des, 0),
            new THREE.Vector3(i + data.height + move, j - des, 0),
          ]);
          move += data.width;
          if (num) {
            count--;
            num.x--;
          }
          if (num && num.x === 0) return <any>pf;
          if (num && count === 0) continue;
        } else {
          let center = new THREE.Vector3(i + (data.width / 2) + move, j + (data.width / 2) - des, 0);
          // 错位
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.height + move, j + data.width - des, 0), center, -Math.PI / 2),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + move, j + data.width - des, 0), center, -Math.PI / 2),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + move, j - des, 0), center, -Math.PI / 2),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.height + move, j - des, 0), center, -Math.PI / 2),
          ]);
          move += data.width;
          if (num) {
            count--;
            num.x--;
          }
          if (num && num.x === 0) return <any>pf;
          if (num && count === 0) continue;
        }
      }
      if (num) count = num.y;
      des += next ? 0 : desm;
      move = 0;
      console.log('changfe');
      next = !next;
    }
    return <any>pf;
  }
}
