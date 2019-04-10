import {Earcut, Node} from './tamu.earcut';
import {Vector3} from 'three';

export class ShapeUtils {

  // calculate area of the contour polygon
  static area (contour: Node[]) {
    let n = contour.length;
    let a = 0.0;

    for (let p = n - 1, q = 0; q < n; p = q ++) {
      a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
    }

    return a * 0.5;
  }

  static isClockWise (pts: Node[]): boolean {
    return ShapeUtils.area(pts) < 0;
  }

  // TODO 类型声明
  static triangulateShape (contour: Vector3[], holes: any[]) {
    let vertices: number[] = []; // flat array of vertices like [x0,y0, x1,y1, x2,y2, ...]
    let holeIndices = []; // array of hole indices
    let faces = []; // final array of vertex indices like [[a,b,d], [b,c,d]]
    console.log('earcut -> contour:', contour);
    console.log('earcut -> holes:', holes);
    removeDupEndPts(contour);
    addContour(vertices, contour);

    let holeIndex = contour.length;

    holes.forEach(removeDupEndPts);

    for (let i = 0; i < holes.length; i ++) {
      holeIndices.push(holeIndex);
      holeIndex += holes[i].length;
      addContour(vertices, holes[i]);
    }
    let verticeList = [].concat(contour.map(v => [v.x, v.y]).flat(2)).concat(holes.flat(3));

    // console.log('🔥 -> contour:', contour.map(v => [v.x, v.y]).flat(2));
    // console.log('🔥 -> holes:', holes.flat(3));
    // console.log('🔥 -> vertices:', vertices);
    console.log('🔥 -> verticeList:', verticeList);
    console.log('🔥 -> holeIndices:', holeIndices);
    let triangles = Earcut.triangulate(verticeList, holeIndices);
    for (let i = 0; i < triangles.length; i += 3) {
      faces.push(triangles.slice(i, i + 3));
    }
    console.log('🍀 -> triangleIndex:', triangles);
    console.log('🍀 -> faces:', faces);
    return faces;
  }
}

function removeDupEndPts(points: Vector3[]) {
  let l = points.length;
  if (l > 2 && points[l - 1] === points[0]) {
    points.pop();
  }
}

function addContour(vertices: number[], contour: Vector3[]) {
  for (let i = 0; i < contour.length; i ++) {
    vertices.push(contour[i].x);
    vertices.push(contour[i].y);
  }
}
