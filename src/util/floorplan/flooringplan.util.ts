export class FlooringplanUtil {

    /** Determines the distance of a point from a line.
     * @param x Point's x coordinate.
     * @param y Point's y coordinate.
     * @param x1 Line-Point 1's x coordinate.
     * @param y1 Line-Point 1's y coordinate.
     * @param x2 Line-Point 2's x coordinate.
     * @param y2 Line-Point 2's y coordinate.
     * @returns The distance.
     */
    public static pointDistanceFromLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
        let tPoint = FlooringplanUtil.closestPointOnLine(x, y, x1, y1, x2, y2);
        let tDx = x - tPoint.x;
        let tDy = y - tPoint.y;
        return Math.sqrt(tDx * tDx + tDy * tDy);
    }

    /** Gets the projection of a point onto a line.
     * @param x Point's x coordinate.
     * @param y Point's y coordinate.
     * @param x1 Line-Point 1's x coordinate.
     * @param y1 Line-Point 1's y coordinate.
     * @param x2 Line-Point 2's x coordinate.
     * @param y2 Line-Point 2's y coordinate.
     * @returns The point.
     */
    static closestPointOnLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number): { x: number, y: number } {
        // Inspired by: http://stackoverflow.com/a/6853926
        let tA = x - x1;
        let tB = y - y1;
        let tC = x2 - x1;
        let tD = y2 - y1;

        let tDot = tA * tC + tB * tD;
        let tLenSq = tC * tC + tD * tD;
        let tParam = tDot / tLenSq;

        let tXx, tYy;

        if (tParam < 0 || (x1 === x2 && y1 === y2)) {
            tXx = x1;
            tYy = y1;
        } else if (tParam > 1) {
            tXx = x2;
            tYy = y2;
        } else {
            tXx = x1 + tParam * tC;
            tYy = y1 + tParam * tD;
        }

        return {
            x: tXx,
            y: tYy
        };
    }

    /** Gets the distance of two points.
     * @param x1 X part of first point.
     * @param y1 Y part of first point.
     * @param x2 X part of second point.
     * @param y2 Y part of second point.
     * @returns The distance.
     */
    static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2));
    }

    /**  Gets the angle between 0,0 -> x1,y1 and 0,0 -> x2,y2 (-pi to pi)
     * @returns The angle.
     */
    static angle(x1: number, y1: number, x2: number, y2: number): number {
        let tDot = x1 * x2 + y1 * y2;
        let tDet = x1 * y2 - y1 * x2;
        let tAngle = -Math.atan2(tDet, tDot);
        return tAngle;
    }
  /**  Gets the angle between 0,0 -> x1,y1 and 0,0 -> x2,y2 (-pi to pi)
   * @returns The angle.
   */
  static vectorAngle(x1: number, y1: number, x2: number, y2: number): number {
    let _a = Math.sqrt(x1 * x1 + y1 * y1);
    let _b = Math.sqrt(x2 * x2 + y2 * y2);
    let xy = x1 * x2 + y1 * y2;
    let tAngle = Math.acos(xy / (_a * _b));
    return tAngle;
  }
    /** shifts angle to be 0 to 2pi */
    static angle2pi(x1: number, y1: number, x2: number, y2: number) {
        let tTheta = FlooringplanUtil.angle(x1, y1, x2, y2);
        if (tTheta < 0) {
            tTheta += 2 * Math.PI;
        }
        return tTheta;
    }

    /** Checks if an array of points is clockwise.
     * @param points Is array of points with x,y attributes
     * @returns True if clockwise.
     */
    static isClockwise(points): boolean {
        // make positive
        let tSubX = Math.min(0, Math.min.apply(null, FlooringplanUtil.map(points, (p) =>  {
            return p.x;
        })));
        let tSubY = Math.min(0, Math.min.apply(null, FlooringplanUtil.map(points, (p) =>  {
            return p.x;
        })));

        let tNewPoints = FlooringplanUtil.map(points, (p) =>  {
            return {
                x: p.x - tSubX,
                y: p.y - tSubY
            };
        });

        // determine CW/CCW, based on:
        // http://stackoverflow.com/questions/1165647
        let tSum = 0;
        for (let tI = 0; tI < tNewPoints.length; tI++) {
            let tC1 = tNewPoints[tI];
            let tC2: any;
            if (tI === tNewPoints.length - 1) {
                tC2 = tNewPoints[0];
            } else {
                tC2 = tNewPoints[tI + 1];
            }
            tSum += (tC2.x - tC1.x) * (tC2.y + tC1.y);
        }
        return (tSum >= 0);
    }

    /** Creates a Guid.
     * @returns A new Guid.
     */
    static guid(): /* () => */ string {
        let tS4 =  () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return tS4() + tS4() + '-' + tS4() + '-' + tS4() + '-' +
            tS4() + '-' + tS4() + tS4() + tS4();
    }

    /** both arguments are arrays of corners with x,y attributes */
    static polygonPolygonIntersect(firstCorners, secondCorners): boolean {
        for (let tI = 0; tI < firstCorners.length; tI++) {
            let tFirstCorner = firstCorners[tI],
                tSecondCorner;

            if (tI === firstCorners.length - 1) {
                tSecondCorner = firstCorners[0];
            } else {
                tSecondCorner = firstCorners[tI + 1];
            }

            if (FlooringplanUtil.linePolygonIntersect(
                tFirstCorner.x, tFirstCorner.y,
                tSecondCorner.x, tSecondCorner.y,
                secondCorners)) {
                return true;
            }
        }
        return false;
    }

    /** Corners is an array of points with x,y attributes */
    static linePolygonIntersect(x1: number, y1: number, x2: number, y2: number, corners): boolean {
        for (let tI = 0; tI < corners.length; tI++) {
            let tFirstCorner = corners[tI],
                tSecondCorner;
            if (tI === corners.length - 1) {
                tSecondCorner = corners[0];
            } else {
                tSecondCorner = corners[tI + 1];
            }

            if (FlooringplanUtil.lineLineIntersect(x1, y1, x2, y2,
                tFirstCorner.x, tFirstCorner.y,
                tSecondCorner.x, tSecondCorner.y)) {
                return true;
            }
        }
        return false;
    }

    /** */
    static lineLineIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
        let tP1 = { x: x1, y: y1 },
            tP2 = { x: x2, y: y2 },
            tP3 = { x: x3, y: y3 },
            tP4 = { x: x4, y: y4 };
        return (this.tCCW(tP1, tP3, tP4) !== this.tCCW(tP2, tP3, tP4)) && (this.tCCW(tP1, tP2, tP3) !== this.tCCW(tP1, tP2, tP4));
    }
    static tCCW(p1, p2, p3) {
        let tA = p1.x,
            tB = p1.y,
            tC = p2.x,
            tD = p2.y,
            tE = p3.x,
            tF = p3.y;
        return (tF - tB) * (tC - tA) > (tD - tB) * (tE - tA);
    }
    // 计算一个点是否在多边形里,参数:点,多边形数组
    /*static pointInPolygon3(pt, poly) {
      for (let c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
      return c;
    }*/
    /**
     @param corners Is an array of points with x,y attributes
     @param startX X start coord for raycast
     @param startY Y start coord for raycast
     */
    static pointInPolygon(x: number, y: number, corners, startX?: number, startY?: number): boolean {
        startX = 99999;
        startY = 99999;
        // ensure that point(startX, startY) is outside the polygon consists of corners
        let tMinX = 0,
            tMinY = 0;

        if (startX === undefined || startY === undefined) {
            for (let tI = 0; tI < corners.length; tI++) {
                tMinX = Math.min(tMinX, corners[tI].x);
                tMinY = Math.min(tMinX, corners[tI].y);
            }
            startX = tMinX - 10;
            startY = tMinY - 10;
        }

        let tIntersects = 0;
        for (let tI = 0; tI < corners.length; tI++) {
            let tFirstCorner = corners[tI],
                tSecondCorner;
            if (tI === corners.length - 1) {
                tSecondCorner = corners[0];
            } else {
                tSecondCorner = corners[tI + 1];
            }

            if (FlooringplanUtil.lineLineIntersect(startX, startY, x, y,
                tFirstCorner.x, tFirstCorner.y,
                tSecondCorner.x, tSecondCorner.y)) {
                tIntersects++;
            }
        }
        let inside = false;
        for (let i = 0; i < corners.length - 1; i++) {
          let corner = corners[i];
          let corner1 = corners[i + 1];
          let xi = corner.x, yi = corner.y;
          let xj = corner1.x, yj = corner1.y;
          let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
        // odd intersections means the point is in the polygon
        // return ((tIntersects % 2) === 1);

    }
    /**
     @param corners Is an array of points with x,y attributes
     @param startX X start coord for raycast
     @param startY Y start coord for raycast
     */
    static pointInPolygon2(x: number, y: number, corners, startX?: number, startY?: number): boolean {
      // startX = startX || 0;
      // startY = startY || 0;

      // ensure that point(startX, startY) is outside the polygon consists of corners
      let tMinX = 0,
        tMinY = 0;

      if (startX === undefined || startY === undefined) {
        for (let tI = 0; tI < corners.length; tI++) {
          tMinX = Math.min(tMinX, corners[tI].x);
          tMinY = Math.min(tMinX, corners[tI].y);
        }
        startX = tMinX - 10;
        startY = tMinY - 10;
      }

      let tIntersects = 0;
      for (let tI = 0; tI < corners.length; tI++) {
        let tFirstCorner = corners[tI],
          tSecondCorner;
        if (tI === corners.length - 1) {
          tSecondCorner = corners[0];
        } else {
          tSecondCorner = corners[tI + 1];
        }

        if (FlooringplanUtil.lineLineIntersect(startX, startY, x, y,
          tFirstCorner.x, tFirstCorner.y,
          tSecondCorner.x, tSecondCorner.y)) {
          tIntersects++;
        }
      }
      // odd intersections means the point is in the polygon
      return ((tIntersects % 2) === 1);
    }
    /** Checks if all corners of insideCorners are inside the polygon described by outsideCorners */
    static polygonInsidePolygon(insideCorners, outsideCorners, startX: number, startY: number): boolean {
        startX = startX || 0;
        startY = startY || 0;

        for (let tI = 0; tI < insideCorners.length; tI++) {
            if (!FlooringplanUtil.pointInPolygon2(
                insideCorners[tI].x, insideCorners[tI].y,
                outsideCorners,
                startX, startY)) {
                return false;
            }
        }
        return true;
    }

    /** Checks if any corners of firstCorners is inside the polygon described by secondCorners */
    static polygonOutsidePolygon(insideCorners, outsideCorners, startX?: number, startY?: number): boolean {
        startX = startX || 0;
        startY = startY || 0;

        for (let tI = 0; tI < insideCorners.length; tI++) {
            if (FlooringplanUtil.pointInPolygon2(
                insideCorners[tI].x, insideCorners[tI].y,
                outsideCorners,
                startX, startY)) {
                return false;
            }
        }
        return true;
    }

    // arrays
    static forEach(array, action) {
        for (let tI = 0; tI < array.length; tI++) {
            action(array[tI]);
        }
    }

    static forEachIndexed(array, action) {
        for (let tI = 0; tI < array.length; tI++) {
            action(tI, array[tI]);
        }
    }

    static map(array, func) {
        let tResult = [];
        array.forEach((element) => {
            tResult.push(func(element));
        });
        return tResult;
    }

    /** Remove elements in array if func(element) returns true */
    static removeIf(array, func) {
        let tResult = [];
        array.forEach((element) => {
            if (!func(element)) {
                tResult.push(element);
            }
        });
        return tResult;
    }

    /** Shift the items in an array by shift (positive integer) */
    static cycle(arr, shift) {
        let tReturn = arr.slice(0);
        for (let tI = 0; tI < shift; tI++) {
            let tmp = tReturn.shift();
            tReturn.push(tmp);
        }
        return tReturn;
    }

    /** Returns in the unique elemnts in arr */
    static unique(arr, hashFunc) {
        let tResults = [];
        let tMap = {};
        for (let tI = 0; tI < arr.length; tI++) {
            if (!tMap.hasOwnProperty(arr[tI])) {
                tResults.push(arr[tI]);
                tMap[hashFunc(arr[tI])] = true;
            }
        }
        return tResults;
    }

    /** Remove value from array, if it is present */
    static removeValue(array, value) {
        for (let tI = array.length - 1; tI >= 0; tI--) {
            if (array[tI] === value) {
                array.splice(tI, 1);
            }
        }
    }

    /** Checks if value is in array */
    static hasValue (array, value): boolean {
        for (let tI = 0; tI < array.length; tI++) {
            if (array[tI] === value) {
                return true;
            }
        }
        return false;
    }
    /*/!** Subtracts the elements in subArray from array *!/
    static subtract(array, subArray) {
        return this.removeIf(array,  (el) => {
            return this.hasValue(subArray, el);
        });
    }*/

    static moveOnAxis(x, y, v1, v2, distance): {x: number, y: number} {
      let v1v2 = Math.sqrt(v1 * v1 + v2 * v2);
      let temp = distance / v1v2;
      let v1_1 = v1 * temp;
      let v2_1 = v2 * temp;
      return {x: v1_1 + x, y: v2_1 + y};
    }

}
