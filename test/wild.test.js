const {Wild} = require('../src/wild.js');

test("wild creation", () => {
  const kind = 11
  const u = new Wild(kind)
  expect(u.kind).toBe(kind);
  expect(u.id).toBe(1);
});

test("wild move", () => {
  const u = new Wild(0)
  expect(u.point).toEqual([0, 0])
  u.move([1, 1])
  expect(u.point).toEqual([1, 1])
});
