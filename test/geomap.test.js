const {GeoMap} = require('../src/geomap.js');
const {Wild} = require('../src/wild.js');

test("geomap", () => {
  const u = new Wild(0)
  M = new GeoMap()
  u.move([1, 1])
  
  expect(M.add(u)).toBe(true)
  expect(M.get(u.point)).toEqual(u)
  expect(M.get([1, 1])).toEqual(u)
  expect(M.get([2, 2])).toBeFalsy()

  expect(M.get_points().length).toBe(1)
  expect(M.get_vals().length).toBe(1)

  expect(M.remove([2, 2])).toBe(false)
  expect(M.remove([1, 1])).toBe(true)
  expect(M.get([1, 1])).toBeFalsy()

  expect(M.get_points().length).toBe(0)
  expect(M.get_vals().length).toBe(0)


});
