import rescale from "../rescale"

test('maps 0.5 in [0, 1] to 0.75 in [0.5, 1]', () => {
  expect(rescale({
    value: 0.5,
    oldMin: 0,
    oldMax: 1,
    newMin: 0.5,
    newMax: 1
  })).toBe(0.75);
})

test('maps 10 in [0, 100] to 21 in [20, 30]', () => {
  expect(rescale({
    value: 10,
    oldMin: 0,
    oldMax: 100,
    newMin: 20,
    newMax: 30
  })).toBe(21);
})