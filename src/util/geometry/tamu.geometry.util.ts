import * as THREE from 'three';
import 'polybooljs';

declare const PolyBool: any;

export class TamuGeometryUtil {

  static buildShape(verticles: any, polygon: any): THREE.Shape[] {
    let shapeList: any = [];
    polygon = this.threeVector2BuildPolyList(polygon.concat(polygon[0]));
    verticles.forEach((ver: any) => {
      let _face = this.threeVector2BuildPolyList(ver);
      let intersect = PolyBool.intersect({
        regions: [_face],
        inverted: false,
      }, {
        regions: [polygon],
        inverted: false,
      });
      if (intersect.regions.length > 0) {
        _face = this.threeVector2BuildPolyList(ver);
        intersect = PolyBool.intersect({
          regions: [_face],
          inverted: false,
        }, {
          regions: [polygon],
          inverted: true,
        });
        let shape = new THREE.Shape(ver);
        if (intersect.regions.length > 0) {
          intersect.regions.forEach((reg: any) => {
            shape.holes.push(new THREE.Path(this.polyListBuildThreeVector2(reg)));
          });
        }
        shapeList.push(shape);
      }
    });
    console.log('sh', shapeList);
    return shapeList;
  }

  static buildUv(verticles: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3])

  /**
   * 修改多边形的方向
   * @param poly
   * @returns any
   */
  static changePolyDirection(poly: any) {
    let _poly = [poly[0]];
    for (let i = poly.length - 1; i > 0; i--) {
      _poly.push(poly[i]);
    }
    return _poly;
  }

  static threeVector2BuildPolyList(vecotrs: THREE.Vector3[]) {
    let poly: any = [];
    vecotrs.forEach((vec: any) => {
      poly.push([vec.x, vec.y]);
    });
    return poly;
  }

  static vec3ToVec2(vec3s: any) {
    let _vecs: any = [];
    vec3s.forEach((vec: any) => {
      _vecs.push(new THREE.Vector2(vec.x, vec.y));
    });
    return _vecs;
  }

  static polyListBuildThreeVector2(polyList: any) {
    let vecList: any = [];
    polyList.forEach((point: any) => {
      vecList.push(new THREE.Vector2(point[0], point[1]));
    });
    return vecList;
  }
}
