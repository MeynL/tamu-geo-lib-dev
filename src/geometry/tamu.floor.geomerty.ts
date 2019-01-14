import * as THREE from 'three';
import 'polybooljs';

declare const PolyBool: any;

export class HalfFace {
  public size: THREE.Vector2;
  public origin: THREE.Vector2;
}

export class TamuFloorGeometry extends THREE.ShapeGeometry {
  private halfs: HalfFace[];
  private start = 0;
  private uvStart = 0;

  private polyJson: any;

  constructor(private shape: THREE.Shape) {
    super(shape);
  }

  /**
   * vertices rule:
   * 1--3      1--3    1--3
   * |  |  or /  /  or  \  \
   * 2--4    2--4        2--4
   * @param vertices
   * @param subsection 几拼图
   */
  public generateFaceUV(vertices: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3][], subsection: number) {
    // let truePoints = [];
    vertices.forEach(p => {
      if (p.length !== 4) {
        return;
      }
      this.buildFace(p[0], p[1], p[2], p[3]);
    });
  }

  private randomHalf(): HalfFace {
    return this.halfs[Math.ceil(this.halfs.length * Math.random())];
  }

  private buildFace(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3) {
    let truePoints: THREE.Vector3[] = [];
    if (this.pointInPoly(p1, this.shape)) {
      truePoints.push(p1);
    }
    if (this.pointInPoly(p2, this.shape)) {
      truePoints.push(p2);
    }
    if (this.pointInPoly(p3, this.shape)) {
      truePoints.push(p3);
    }
    if (this.pointInPoly(p4, this.shape)) {
      truePoints.push(p4);
    }
    if (truePoints.length === 4) {
      // pushFace([p1, p2, p3, p4], half);
      let triangleList = this.findTriangleFromPoly([p1, p2, p3, p4]);
      triangleList.forEach(triangle => {
        this.pushFace(triangle, this.randomHalf(), [p1, p2, p3, p4]);
      });
    } else if (truePoints.length > 0) {
      let _face = this.threeVector2BuildPolyList([p1, p2, p3, p4]);
      let intersect = PolyBool.intersect({
        regions: [_face],
        inverted: false,
      }, {
        regions: [this.polyJson],
        inverted: false,
      });
      let vecs = this.polyListBuildThreeVector2(intersect.regions[0]);
      if (!this.computePolyDirection(vecs)) {
        vecs = this.changePolyDirection(vecs);
      }
      let triangleList = this.findTriangleFromPoly(vecs);
      triangleList.forEach(triangle => {
        this.pushFace(triangle, this.randomHalf(), [p1, p2, p3, p4]);
      });
    }
  }

  private pushFace(pointList: THREE.Vector3[], half: HalfFace, polyAxis: THREE.Vector3[]) {
    if (pointList.length !== 3) return;
    this.vertices.push(pointList[0]);
    this.vertices.push(pointList[1]);
    this.vertices.push(pointList[2]);
    this.faces.push(new THREE.Face3(
      this.start + 0,
      this.start + 1,
      this.start + 2,
      new THREE.Vector3(0, 1, 0), new THREE.Color('#FFFFFF'), 0));
    this.faceVertexUvs[0][this.uvStart] = [];
    this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(pointList[0], polyAxis, {
      size: new THREE.Vector2(.5, 1),
      pos: new THREE.Vector2(.5, 0)
    }));
    this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(pointList[1], polyAxis, {
      size: new THREE.Vector2(.5, 1),
      pos: new THREE.Vector2(.5, 0)
    }));
    this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(pointList[2], polyAxis, {
      size: new THREE.Vector2(.5, 1),
      pos: new THREE.Vector2(.5, 0)
    }));
    this.uvStart++;
    this.start += 3;
  }

  /**
   * 判断点是否在多边形内部
   * @param point
   * @param poly
   */
  private pointInPoly(point: THREE.Vector3, poly: any) {
    let c = false;
    for (let i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      if ((poly[i].y <= point.y && point.y < poly[j].y) || (poly[j].y <= point.y && point.y < poly[i].y)
        && (point.x < (poly[j].x - poly[i].x) * (point.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)) {
        c = !c;
      }
    }
    return c;
  }

  /**
   * 计算多边形的方向
   * @param poly
   * @returns boolean
   */
  private computePolyDirection(poly: any) {
    let _poly = poly.concat([poly[0]]);
    let d = 0;
    for (let i = 0; i < _poly.length - 1; i++) {
      d += -.5 * (_poly[i].y + _poly[i + 1].y) * (_poly[i + 1].x - _poly[i].x);
    }
    return d > 0;
  }

  /**
   * 修改多边形的方向
   * @param poly
   * @returns any
   */
  private changePolyDirection(poly: any) {
    let _poly = [poly[0]];
    for (let i = poly.length - 1; i > 0; i--) {
      _poly.push(poly[i]);
    }
    return _poly;
  }

  /**
   * 找到坐标对应在uv中的位置
   * uvAxis:
   * 1--3
   * |  |
   * 2--4
   * @param pos
   * @param uvAxis
   * @returns any
   */
  private findUvPosition(pos: THREE.Vector3, uvAxis: any, uvTranslate: any) {
    uvAxis = [
      uvAxis[0].clone(),
      uvAxis[1].clone(),
      uvAxis[2].clone(),
      uvAxis[3].clone()
    ];
    pos = pos.clone();
    let uvPos;
    let vecPos = pos.clone().sub(uvAxis[1].clone());
    let linePos = new THREE.Line3(uvAxis[1].clone(), pos.clone());
    let vecX = uvAxis[2].clone().sub(uvAxis[1].clone());
    let vecY = uvAxis[0].clone().sub(uvAxis[1].clone());
    let lineX = new THREE.Line3(uvAxis[1], uvAxis[2]);
    let lineY = new THREE.Line3(uvAxis[1], uvAxis[0]);
    let ang1 = vecPos.dot(vecX) / (linePos.distance() * lineX.distance());
    let ang2 = vecPos.dot(vecY) / (linePos.distance() * lineY.distance());
    let lX = ang1 * linePos.distance();
    let lY = ang2 * linePos.distance();
    lX = lX ? lX : 0;
    lY = lY ? lY : 0;
    uvPos = new THREE.Vector2(lX / lineX.distance() * uvTranslate.size.x + uvTranslate.pos.x, lY / lineY.distance() * uvTranslate.size.y + uvTranslate.pos.y);
    return uvPos;
  }

  private findTriangleFromPoly(poly: any) {
    let triangleList = [];
    for (let i = 0; i < poly.length - 1; i++) {
      triangleList.push([poly[0], poly[i], poly[i + 1]]);
    }
    return triangleList;
  }

  private threeVector2BuildPolyList(vecotrs: any) {
    let poly: any = [];
    vecotrs.forEach((vec: any) => {
      poly.push([vec.x, vec.y]);
    });
    return poly;
  }

  private polyListBuildThreeVector2(polyList: any) {
    let vecList: any = [];
    polyList.forEach((point: any) => {
      vecList.push(new THREE.Vector3(point[0], point[1], 0));
    });
    return vecList;
  }
}
