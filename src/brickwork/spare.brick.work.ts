import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';
import {TamuGeometryUtil} from '../util/geometry/tamu.geometry.util';
import * as THREE from 'three';

export class SpareBrickWork implements TamuBrickWorkBase {
  public version = 'brickwork_spare';

  private animationUtil: AnimationBase;

  constructor(version?: any) {
    if (version) this.version = version;
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
    let vertices = this.makeVertices(data, new THREE.Vector2(data.width, data.height), new THREE.Vector2(data.width * 2, data.height * 2), new THREE.Vector2(6, 3));
    let objs: THREE.Mesh[] = [];
    let matrixes: any = [];
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
      matrixes.push(new THREE.Matrix4().getInverse(
        new THREE.Matrix4().makeTranslation(-_center.x, _center.y, _center.z)));
      objs.push(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({wireframe: true})));
    });
    return {objs: objs, materixes: matrixes};
  }

  makeVertices(data: any, start: THREE.Vector2, size: THREE.Vector2, num?: THREE.Vector2): [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][] {
    let pf = [];
    let next = true;
    let count;
    // num = new THREE.Vector2(4, 2);
    if (num) {
      count = num.y;
    }
    for (let j = start.y - data.height; j <= start.y + size.y; j += data.height) {
      for (let i = start.x - data.width; i <= start.x + size.x; i += data.width) {
        if (num && num.x === 0) return <any>pf;
        if (num && count === 0) continue;
        if (next) {
          // 正常
          pf.push([
            new THREE.Vector3(i, j + data.height, 0),
            new THREE.Vector3(i, j, 0),
            new THREE.Vector3(i + data.width, j, 0),
            new THREE.Vector3(i + data.width, j + data.height, 0),
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
            new THREE.Vector3(i + data.width * .5, j + data.height, 0),
            new THREE.Vector3(i + data.width * .5, j, 0),
            new THREE.Vector3(i + data.width * 1.5, j, 0),
            new THREE.Vector3(i + data.width * 1.5, j + data.height, 0),
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
