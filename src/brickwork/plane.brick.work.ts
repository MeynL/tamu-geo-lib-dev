import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuGeometryUtil} from '../util/geometry/tamu.geometry.util';
import * as THREE from 'three';
import {ShapeGeometry} from 'three';

export class PlaneBrickWork implements TamuBrickWorkBase {

  public version = 'plane';

  private animationUtil: AnimationBase;

  constructor(version?: any) {
    if (version) this.version = version;
  }

  makeObject(data: { width: number, height: number, subsection: number, angle: number }, shape: THREE.Shape): THREE.Geometry {
    if (!data.angle) data.angle = 0;
    let geometry = new ShapeGeometry(shape);

    geometry.computeBoundingBox();

    let max = geometry.boundingBox.max,
      min = geometry.boundingBox.min;
    let offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    let faces = geometry.faces;
    geometry.faceVertexUvs[0] = [];

    for (let i = 0; i < faces.length; i++) {

      let v1 = geometry.vertices[faces[i].a],
        v2 = geometry.vertices[faces[i].b],
        v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
        new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
        new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y),
      ]);
    }
    geometry.uvsNeedUpdate = true;
    geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0];
    console.log('shape', geometry);
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
    // num = new THREE.Vector2(4, 2);
    if (num) {
      count = num.y;
    }
    for (let i = start.x - data.width; i <= start.x + size.x; i += data.width) {
      for (let j = start.y - data.height; j <= start.y + size.y; j += data.height) {
        if (num && num.x === 0) return <any>pf;
        if (num && count === 0) continue;
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
      }
      if (num) count = num.y;
    }
    return <any>pf;
  }
}
