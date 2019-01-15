import {TamuBrickWorkBase} from './base/tamu.brick.work.base';
import {AnimationBase} from '../animation/base/animation.base';
import {TamuFloorGeometry} from '../geometry/tamu.floor.geomerty';
import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import {TamuGeometryUtil} from '../util/geometry/tamu.geometry.util';
import * as THREE from 'three';

export class BubugaoBrickWork implements TamuBrickWorkBase {
  private animationUtil: AnimationBase;

  constructor() {
  }

  makeObject(data: { width: number, height: number, subsection: number }, shape: THREE.Shape): THREE.Mesh {
    let geometry = new TamuFloorGeometry(shape);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    let size = geometry.boundingBox.max.sub(geometry.boundingBox.min);
    let vertices = this.makeVertices(data, new THREE.Vector2(geometry.boundingBox.min.x, geometry.boundingBox.min.y), new THREE.Vector2(size.x, size.y));
    // let vertices = this.makeVertices(data, new THREE.Vector2(0, 0), new THREE.Vector2(data.width * 2, data.height * 3));
    // let points = shape.extractPoints(1);
    // let shapes = TamuGeometryUtil.buildShape(vertices, (<any>points).shape);
    geometry.generateFaceUV(vertices, data.subsection);
    let plan = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    return plan;
  }

  makeObjects(data: { width: number, height: number, subsection: number}, size?: THREE.Vector2, isAnimate?: boolean): { objs: THREE.Object3D[]; positions: THREE.Vector3[] } {
    console.log('sss', data.width, data.height);
    let vertices = this.makeVertices(data, new THREE.Vector2(0, 0), new THREE.Vector2(data.width * 6, data.height * 4), 2);
    let objs: THREE.Mesh[] = [];
    vertices.forEach(ver => {
      let geo = new TamuFloorGeometry(new THREE.Shape());
      geo.buldSingleFloor(ver, data.subsection);
      // geo.center();
      objs.push(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({wireframe: true})));
      console.log('geo', geo);
    });
    return {objs: objs, positions: [new THREE.Vector3()]};
  }

  makeVertices(data: { width: number, height: number }, start: THREE.Vector2, size: THREE.Vector2, num?: number): [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][] {
    let pf = [];
    let next = true;
    for (let j = start.y - data.height; j <= size.y; j += 3 * (data.width * Math.sqrt(2))) {
      for (let i = start.x - data.width; i <= size.x; i += (data.height / Math.sqrt(2))) {
        if (num === 0) return pf;
        if (num !== 0 && num) num--;
        let center = new THREE.Vector3((i + i + data.width) / 2, (j + j + data.height) / 2, 0);
        if (next) {
          // 正常
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, Math.PI / 4),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, Math.PI / 4),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, Math.PI / 4),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, Math.PI / 4),
          ]);
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) / 2, -data.width * Math.sqrt(2) / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) / 2, -data.width * Math.sqrt(2) / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) / 2, -data.width * Math.sqrt(2) / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) / 2, -data.width * Math.sqrt(2) / 2, 0)),
          ]);
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2), -data.width * Math.sqrt(2), 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2), -data.width * Math.sqrt(2), 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2), -data.width * Math.sqrt(2), 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2), -data.width * Math.sqrt(2), 0)),
          ]);
        } else {
          // 错位
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 2 / 2, -data.width * Math.sqrt(2) * 3 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 2 / 2, -data.width * Math.sqrt(2) * 3 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 2 / 2, -data.width * Math.sqrt(2) * 3 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 2 / 2, -data.width * Math.sqrt(2) * 3 / 2, 0)),
          ]);
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 1 / 2, -data.width * Math.sqrt(2) * 4 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 1 / 2, -data.width * Math.sqrt(2) * 4 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 1 / 2, -data.width * Math.sqrt(2) * 4 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 1 / 2, -data.width * Math.sqrt(2) * 4 / 2, 0)),
          ]);
          pf.push([
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j + data.height, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 0 / 2, -data.width * Math.sqrt(2) * 5 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i, j, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 0 / 2, -data.width * Math.sqrt(2) * 5 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 0 / 2, -data.width * Math.sqrt(2) * 5 / 2, 0)),
            FlooringplanUtil.rotateCornerZ(new THREE.Vector3(i + data.width, j + data.height, 0), center, -Math.PI / 4)
              .add(new THREE.Vector3(-data.width * Math.sqrt(2) * 0 / 2, -data.width * Math.sqrt(2) * 5 / 2, 0)),
          ]);
        }
        next = !next;
      }
    }
    return pf;
  }

}
