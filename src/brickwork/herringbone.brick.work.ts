import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuGeometryUtil} from '../util/geometry/tamu.geometry.util';
import * as THREE from 'three';

export class HerringboneBrickWork implements TamuBrickWorkBase {

  public version = 'diamond';

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
    let vertices = this.makeVertices(data, new THREE.Vector2(0, 0), new THREE.Vector2(data.width * 10, data.height * 10), new THREE.Vector2(6, 3));
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
      if (index > 2) {
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

    let unit = muip * data.width + data.height;
    let total = size.x + 2 * data.width;
    let paddingX = (Math.ceil(total / unit)) * unit;
    let paddingY = (Math.ceil(total / unit)) * desm;

    if (num) {
      count = num.y;
    }
    for (/* start */let i = start.x - data.width; /* end */(i <= start.x + size.x + data.width || !next); /* step */i += next ? (muip * data.width) : (data.height)) {
      for (/* start */let j = start.y - 2 * data.height; /* end */j <= start.y + size.y + 2 * data.height; /* step */j += data.width) {
        if (num && num.x === 0) return <any>pf;
        if (num && count === 0) continue;
        const vertex = [
          new THREE.Vector3(i + move + data.height, j - des + data.width, 0),
          new THREE.Vector3(i + move              , j - des + data.width, 0),
          new THREE.Vector3(i + move              , j - des             , 0),
          new THREE.Vector3(i + move + data.height, j - des             , 0),
        ];
        if (next) {
          // 平移
          let _vertex = vertex.map(v => {
            if (i + move > start.x + size.x + data.width) {
              v.setX(v.x - paddingX);
              v.setY(v.y + paddingY);
            }
            return v;
          });
          // 正常
          pf.push(_vertex);
          move += data.width;
          if (num) {
            count--;
            num.x--;
          }
          if (num && num.x === 0) return <any>pf;
          if (num && count === 0) continue;
        } else {
          let center = new THREE.Vector3(i + (data.width / 2) + move, j + (data.width / 2) - des, 0);
          // 平移
          let _vertex = vertex.map(v => {
            let _v = FlooringplanUtil.rotateCornerZ(v, center, -Math.PI / 2);
            if (i + move > start.x + size.x + data.width) {
              _v.setX(_v.x - paddingX);
              _v.setY(_v.y + paddingY);
            }
            return _v;
          });
          // 错位
          pf.push(_vertex);
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
