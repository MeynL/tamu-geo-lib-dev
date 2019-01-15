import * as THREE from 'three';
import 'polybooljs';

declare const PolyBool: any;

export class TamuGeometryUtil {

  public static buildShape(verticles, polygon): THREE.Shape[] {
    let shapeList = [];
    polygon = this.threeVector2BuildPolyList(polygon.concat(polygon[0]));
    verticles.forEach(ver => {
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
          intersect.regions.forEach(reg => {
            shape.holes.push(new THREE.Path(this.polyListBuildThreeVector2(reg)));
          });
        }
        shapeList.push(shape);
      }
    });
    console.log('sh', shapeList);
    return shapeList;
  }

  /**
   * 修改多边形的方向
   * @param poly
   * @returns any
   */
  public static changePolyDirection(poly: any) {
    let _poly = [poly[0]];
    for (let i = poly.length - 1; i > 0; i--) {
      _poly.push(poly[i]);
    }
    return _poly;
  }

  private static threeVector2BuildPolyList(vecotrs: THREE.Vector3[]) {
    let poly: any = [];
    vecotrs.forEach((vec: any) => {
      poly.push([vec.x, vec.y]);
    });
    return poly;
  }

  private static vec3ToVec2(vec3s) {
    return vec3s.map(vec3 => new THREE.Vector2(vec3.x, vec3.y));
  }

  private static polyListBuildThreeVector2(polyList: any) {
    let vecList: any = [];
    polyList.forEach((point: any) => {
      vecList.push(new THREE.Vector2(point[0], point[1]));
    });
    return vecList;
  }
}
