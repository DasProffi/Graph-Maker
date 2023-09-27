export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  const xDiff = x2 - x1
  const yDiff = y2 - y1
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

export const distanceFromDiff = (xDiff: number, yDiff: number): number => {
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}
