import {FlooringplanUtil} from '../util/floorplan/flooringplan.util';
import * as THREE from 'three';
// import {ShapeUtils} from './tamu.shape.util';
import 'polybooljs';

declare const PolyBool: any;

export class HalfFace {
  public size: THREE.Vector2;
  public pos: THREE.Vector2;
}

export class TamuFloorGeometry extends THREE.ShapeGeometry {
  private halfs: HalfFace[] = [];
  private start = 0;
  private uvStart = 0;
  private half: HalfFace;

  private poly: any;
  private polyJson: any;

  constructor(private shape: THREE.Shape) {
    super(shape);
    if (this.vertices.length > 0) {
      this.poly = this.vertices.concat(this.vertices[0]);
      this.polyJson = this.threeVector2BuildPolyList(this.poly);
    }
    // this.halfs = [{
    //   size: new THREE.Vector2(1, 1),
    //   pos: new THREE.Vector2(0, 0),
    // }];
  }

  public buldSingleFloor(subsection: number) {
    let vertices = this.vertices.concat([]);
    this.clearShape();
    this.buildHalfFace(subsection);
    this.randomHalf();
    let triangles = this.findTriangleFromPoly(this.threeVector2BuildPolyList(vertices));
    triangles.forEach(triangle => {
      this.pushFace(this.polyListBuildThreeVector2(triangle), this.half, vertices);
    });
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
    for (let i = 0; i < subsection; i++) {
      this.halfs.push({
        size: new THREE.Vector2(1 / subsection, 1),
        pos: new THREE.Vector2(1 * i / subsection, 0),
      });
    }
    this.vertices = [];
    this.faces = [];
    this.faceVertexUvs[0] = [];
    vertices.forEach(p => {
      if (p.length !== 4) {
        return;
      }
      this.buildFace(p[0], p[1], p[2], p[3]);
    });
  }

  public buildHalfFace(subsection: number) {
    this.halfs = [];
    for (let i = 0; i < subsection; i++) {
      this.halfs.push({
        size: new THREE.Vector2(1 / subsection, 1),
        pos: new THREE.Vector2(1 * i / subsection, 0),
      });
    }
  }

  public clearShape() {
    this.vertices = [];
    this.faces = [];
    this.faceVertexUvs[0] = [];
    this.uvStart = 0;
  }

  public rotatePoly(angle: any) {
    // let maxX, maxY, minX, minY;
    // this.polyJson.forEach(v => {
    //   if (!maxX) maxX = v[0];
    //   if (!maxY) maxY = v[1];
    //   maxX = Math.max(v[0], maxX);
    //   maxY = Math.max(v[1], maxY);
    //   minX = Math.min(v[0], minX);
    //   minY = Math.min(v[1], minY);
    // });
    // // let center = new THREE.Vector3((maxX + minX) / 2, (maxY + minY) / 2, 0);
    // let center = new THREE.Vector3(0, 0, 0);
    // let newPoly = [];
    // this.polyJson.forEach(p => {
    //   let _p = FlooringplanUtil.rotateCornerZ(new THREE.Vector3(p[0], p[1], 0), center, angle);
    //   newPoly = [_p.x, _p.y];
    // });
    // this.polyJson = newPoly;
  }

  public addShapes(shapes: any) {
    let i, l, shapeHole;

    // let indexOffset = this.vertices.length / 3;
    shapes.forEach((shape: any) => {
      let indexOffset = this.vertices.length;
      this.uvStart = this.faceVertexUvs[0].length;
      let points = shape.extractPoints(1);
      let shapeVertices = points.shape;
      let shapeHoles = points.holes;
      let polyAxis = points.shape;
      this.randomHalf();
      // if (ShapeUtils.isClockWise(polyAxis) === false) {
      //   polyAxis = polyAxis.reverse();
      // }

      // check direction of vertices

      // if (ShapeUtils.isClockWise(shapeVertices) === false) {
      //
      //   shapeVertices = shapeVertices.reverse();
      //
      // }

      for (i = 0, l = shapeHoles.length; i < l; i++) {

        shapeHole = shapeHoles[i];

        // if (ShapeUtils.isClockWise(shapeHole) === true) {
        //
        //   shapeHoles[i] = shapeHole.reverse();
        //
        // }

      }

      // let faces = ShapeUtils.triangulateShape(shapeVertices, shapeHoles);

      // join vertices of inner and outer paths to a single array

      for (i = 0, l = shapeHoles.length; i < l; i++) {

        shapeHole = shapeHoles[i];
        shapeVertices = shapeVertices.concat(shapeHole);

      }
      // let faces = [[3, 2, 1], [1, 0, 3]];

      // vertices, normals, uvs

      for (i = 0, l = shapeVertices.length; i < l; i++) {

        let vertex = shapeVertices[i];

        this.vertices.push(new THREE.Vector3(vertex.x, vertex.y, 0));
        // this.normals.push( 0, 0, 1 );
        // uvs.push( vertex.x, vertex.y ); // world uvs

      }

      // incides

      // for (i = 0, l = faces.length; i < l; i++) {
      //
      //   let face = faces[i];
      //
      //   let a = face[0] + indexOffset;
      //   let b = face[1] + indexOffset;
      //   let c = face[2] + indexOffset;
      //
      //   this.faces.push(new THREE.Face3(
      //     a,
      //     b,
      //     c,
      //     new THREE.Vector3(0, 0, 1)
      //   ));
      //
      //   this.faceVertexUvs[0][this.uvStart] = [];
      //   this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(this.vertices[a], polyAxis, this.half));
      //   this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(this.vertices[b], polyAxis, this.half));
      //   this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(this.vertices[c], polyAxis, this.half));
      //   this.uvStart++;
      //
      //   // indices.push( a, b, c );
      //   // groupCount += 3;
      //
      // }
    });
  }

  private randomHalf() {
    this.half = this.halfs[Math.ceil(this.halfs.length * Math.random()) - 1];
  }

  private buildFace(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3) {
    this.randomHalf();
    let truePoints: THREE.Vector3[] = [];
    if (FlooringplanUtil.pointInPolygon2(p1.x, p1.y, this.poly)) {
      truePoints.push(p1);
    }
    if (FlooringplanUtil.pointInPolygon2(p2.x, p2.y, this.poly)) {
      truePoints.push(p2);
    }
    if (FlooringplanUtil.pointInPolygon2(p3.x, p3.y, this.poly)) {
      truePoints.push(p3);
    }
    if (FlooringplanUtil.pointInPolygon2(p4.x, p4.y, this.poly)) {
      truePoints.push(p4);
    }
    if (truePoints.length === 4) {
    // if (truePoints) {
      // pushFace([p1, p2, p3, p4], half);
      let triangleList = this.findTriangleFromPoly([p1, p2, p3, p4]);
      triangleList.forEach(triangle => {
        this.pushFace(triangle, this.half, [p1, p2, p3, p4]);
      });
    } else {
      let _face = this.threeVector2BuildPolyList([p1, p2, p3, p4]);
      let intersect = PolyBool.intersect({
        regions: [_face],
        inverted: false,
      }, {
        regions: [this.polyJson],
        inverted: false,
      });
      if (intersect.regions.length > 0) {
        intersect.regions.forEach((reg: any) => {
          let vecs = this.polyListBuildThreeVector2(reg);
          if (!this.computePolyDirection(vecs)) {
            vecs = this.changePolyDirection(vecs);
          }
          let triangleList = this.findTriangleFromPoly(vecs);
          triangleList.forEach(triangle => {
            this.pushFace(triangle, this.half, [p1, p2, p3, p4]);
          });
        });
      }
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
      new THREE.Vector3(0, 0, 1)));
    this.faceVertexUvs[0][this.uvStart] = [];
    this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(pointList[0], polyAxis, half));
    this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(pointList[1], polyAxis, half));
    this.faceVertexUvs[0][this.uvStart].push(this.findUvPosition(pointList[2], polyAxis, half));
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
        c = true;
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
    for (let i = 1; i < poly.length - 1; i++) {
      triangleList.push([poly[0], poly[i], poly[i + 1]]);
    }
    return triangleList;
  }

  private threeVector2BuildPolyList(vecotrs: THREE.Vector3[]) {
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
