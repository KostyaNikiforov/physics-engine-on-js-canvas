export function getDistanceBetweenPoints(point1, point2) {
    return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}
