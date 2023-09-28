export const inBounds = (value: number, lower: number, higher: number) => {
  if (value < lower) {
    return lower
  }
  if (value > higher) {
    return higher
  }
  return value
}
