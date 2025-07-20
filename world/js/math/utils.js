function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest = null;
  for (const point of points) {
    const dist = distance(point, loc);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = point;
    }
  }
  return nearest;
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function add(a, b) {
  return new Point(a.x + b.x, a.y + b.y);
}

function substract(a, b) {
  return new Point(a.x - b.x, a.y - b.y);
}

function scale(p, scaler) {
  return new Point(p.x * scaler, p.y * scaler);
}

function translate(point, angle, offset) {
  return new Point(
    point.x + Math.cos(angle) * offset,
    point.y + Math.sin(angle) * offset
  );
}

function angle(p) {
  return Math.atan2(p.y, p.x);
}
