import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuGeometryUtil} from '../util/geometry/tamu.geometry.util';
import * as THREE from 'three';

export class XuanzhuanBrickWork implements TamuBrickWorkBase {

  public version = 'xuanzhuan';

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

  makeObjects(data: { width: number, height: number, subsection: number }, size?: THREE.Vector2, isAnimate?: boolean): { objs: THREE.Object3D[]; materixes: THREE.Matrix4[] } {
    let vertices = this.makeVertices(data, new THREE.Vector2(data.width, data.height), new THREE.Vector2(data.width * 5, data.height * 5), new THREE.Vector2(6, 2));
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

  makeVertices(data: { width: number, height: number }, start: THREE.Vector2, size: THREE.Vector2, num?: THREE.Vector2): [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][] {
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
