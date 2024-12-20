export function createUuid(): string {
  const s: any[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    const m = Math.floor(Math.random() * 0x10);
    s[i] = hexDigits.slice(m, m + 1);
  }
  s[14] = "4";
  const n = (s[19] & 0x3) | 0x8;
  s[19] = hexDigits.slice(n, n + 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

/**
 * 判断图形是否符合嵌套关系, 业务需求：只需要判断shape2所有的点是否都在shape1内部即可
 * @param shape1 参数1
 * @param shape2 参数2
 * @reutrn Boolean 符合条件返回true 否则返回false
 */

export function isNested(shape1: any, shape2: any): boolean {
  if (shape1.type === 1 && shape2.type === 1) {
    // 矩形和矩形的判断逻辑
    const [[x1, y1], [x2, y2]] = shape1.coor;
    const [[x3, y3], [x4, y4]] = shape2.coor;

    // if (x1 >= x3 && y1 >= y3 && x2 <= x4 && y2 <= y4) {
    //   return true; // shape1 嵌套在 shape2 内部
    // } else
    if (x1 <= x3 && y1 <= y3 && x2 >= x4 && y2 >= y4) {
      return true; // shape2 嵌套在 shape1 内部
    } else {
      return false; // 两个矩形没有嵌套关系
    }
  } else if (shape1.type === 1 && shape2.type === 2) {
    // 矩形和多边形的判断逻辑，确保多边形所有的坐标点都在矩形里面
    const [[x1, y1], [x2, y2]] = shape1.coor;
    const vertices = shape2.coor;

    for (let i = 0; i < vertices.length; i++) {
      const [x, y] = vertices[i];
      if (x < x1 || x > x2 || y < y1 || y > y2) {
        return false; // 多边形的顶点在矩形外部，不嵌套
      }
    }

    return true; // 所有顶点都在矩形内部，嵌套关系成立
  } else if (shape1.type === 2 && shape2.type === 1) {
    // 多边形和矩形的判断逻辑，确保矩形的所有坐标点都在多边形里面
    const vertices = shape2.coor; // 矩形的顶点坐标

    for (let i = 0; i < vertices.length; i++) {
      const [x, y] = vertices[i];
      if (!isPointInPolygon(x, y, shape1.coor)) {
        return false; // 有一个坐标点不在多边形范围内，返回false
      }
    }

    return true; // 所有坐标点都在多边形内部，返回true
  } else if (shape1.type === 2 && shape2.type === 2) {
    // 多边形和多边形的判断逻辑
    const vertices1 = shape1.coor;
    const vertices2 = shape2.coor;

    for (let i = 0; i < vertices2.length; i++) {
      const [x, y] = vertices2[i];
      if (!isPointInPolygon(x, y, vertices1)) {
        return false; // 多边形2的顶点不都在多边形1内部，不嵌套
      }
    }

    return true; // 有坐标点都在多边形内部，返回true
  }
}

function isPointInPolygon(x: number, y: number, vertices: any) {
  let inside = false;
  const n = vertices.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vertices[i][0];
    const yi = vertices[i][1];
    const xj = vertices[j][0];
    const yj = vertices[j][1];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}
