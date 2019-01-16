import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuGeometryUtil} from '../util/geometry/tamu.geometry.util';
import * as THREE from 'three';

export class HerringboneBrickWork implements TamuBrickWorkBase {

  public version = 'diamond';

  private animationUtil: AnimationBase;

  constructor(version?) {
    if (version) this.version = version;
  }

  makeObject(data: { width: number, height: number, subsection: number }, shape: THREE.Shape): THREE.Geometry {
    let geometry = new TamuFloorGeometry(shape);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    let size = geometry.boundingBox.max.sub(geometry.boundingBox.min);
    let vertices = this.makeVertices(data, new THREE.Vector2(geometry.boundingBox.min.x, geometry.boundingBox.min.y), new THREE.Vector2(size.x, size.y));
    geometry.generateFaceUV(vertices, data.subsection);
    // let plan = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    return geometry;
  }

  makeObjects(data: { width: number, height: number, subsection: number }, size?: THREE.Vector2, isAnimate?: boolean): { objs: THREE.Object3D[]; materixes: THREE.Matrix4[] } {
    let vertices = this.makeVertices(data, new THREE.Vector2(data.width, data.height), new THREE.Vector2(data.width, data.height), new THREE.Vector2(4, 2));
    let objs: THREE.Mesh[] = [];
    let matrixes = [];
    let center = TamuGeometryUtil.getCenter(vertices);
    vertices.forEach((ver: any, index: number) => {
      let geo = new TamuFloorGeometry(new THREE.Shape([
        new THREE.Vector2(ver[0].x, ver[0].y),
        new THREE.Vector2(ver[1].x, ver[1].y),
        new THREE.Vector2(ver[2].x, ver[2].y),
        new THREE.Vector2(ver[3].x, ver[3].y),
      ]));
      geo.buldSingleFloor(data.subsection);
      geo.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));
      let _center = TamuGeometryUtil.getCenter([geo.vertices]);
      if (index > 1) {
        let mat = new THREE.Matrix4().makeTranslation(-_center.x, -_center.y, -_center.z);
        // mat.multiplyMatrices(new THREE.Matrix4().makeRotationZ(-Math.PI / 2), mat);
        matrixes.push(new THREE.Matrix4().getInverse(mat));
      } else {
        let mat = new THREE.Matrix4().makeTranslation(-_center.x, -_center.y, -_center.z);
        mat.multiplyMatrices(new THREE.Matrix4().makeRotationZ(-Math.PI / 2), mat);
        matrixes.push(new THREE.Matrix4().getInverse(mat));
      }
      // matrixes.push(new THREE.Matrix4().getInverse(
      //   new THREE.Matrix4().makeTranslation(-_center.x, _center.y, _center.z)));
      objs.push(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({wireframe: true})));
    });
    return {objs: objs, materixes: matrixes};
  }

  makeVertices(data: { width: number, height: number }, start: THREE.Vector2, size: THREE.Vector2, num?: THREE.Vector2): [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][] {
    let pf = [];
    let next = true;
    let move = 0;
    let muip = Math.floor(data.height / data.width);
    let desm = data.height - (muip * data.width);
    let des = 0;
    let count;
    // num = new THREE.Vector2(4, 2);
    if (num) {
      count = num.y;
    }
    for (let i = start.x - size.x; i <= size.x + data.width; i += next ? (muip * data.width) : (data.height)) {
      for (let j = start.y - data.height; j <= size.y + data.height; j += data.width) {
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
      next = !next;
    }
    return <any>pf;
  }
}
