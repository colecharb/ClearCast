export default ({ oldMin, oldMax, newMin, newMax, value }: { oldMin: number, oldMax: number, newMin: number, newMax: number, value: number }) => {
  const a = (newMax - newMin) / (oldMax - oldMin);
  return a * (value - oldMin) + newMin;
}

// ? I think interpolate() does this already...