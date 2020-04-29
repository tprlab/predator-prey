const {SafeWorld} = require('../src/safe_world.js');
const {Wild} = require('../src/wild.js');

test("basic", () => {
  const w = new SafeWorld(20, 20)
  const u = new Wild(1)
  u.move([10, 10])
  w.add_wild(u)

  keys = w.GM.get_points()
  vals = w.GM.get_vals()

  expect(keys.length).toBe(1)
  expect(vals.length).toBe(1)

  p_old = keys[0]
  console.log("p1", p_old)

  expect(w.roam_wild(u)).toBe(true)

  keys1 = w.GM.get_points()
  vals1 = w.GM.get_vals()

  expect(keys1.length).toBe(1)
  expect(vals1.length).toBe(1)

  expect(w.remove_wild(u)).toBe(true)

  keys2 = w.GM.get_points()
  vals2 = w.GM.get_vals()

  expect(keys2.length).toBe(0)
  expect(vals2.length).toBe(0)

})

test("flow", () => {
  var W = new SafeWorld(20, 20)
  W.start()
  console.log("init", W)
  for (i = 0; i < 3; i++) {
    W.next()
    console.log("Turn", i, W)
  }
})