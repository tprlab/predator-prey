const {MapUtil} = require('../src/maputil.js');

test("adjacent spots middle", () => {
  var a = MapUtil.get_adj([1, 1], 10, 10)
  expect(a.length).toBe(8);
});


test("adjacent spots top-left corner", () => {
  var a = MapUtil.get_adj([0, 0], 10, 10)
  expect(a.length).toBe(3);
});

test("adjacent spots top-right corner", () => {
  var a = MapUtil.get_adj([9, 0], 10, 10)
  expect(a.length).toBe(3);
});

test("adjacent spots bottom-right corner", () => {
  var a = MapUtil.get_adj([9, 9], 10, 10)
  expect(a.length).toBe(3);
});

test("adjacent spots bottom-left corner", () => {
  var a = MapUtil.get_adj([0, 9], 10, 10)
  expect(a.length).toBe(3);
});

test("adjacent spots upper edge", () => {
  var a = MapUtil.get_adj([5, 0], 10, 10)
  expect(a.length).toBe(5);
});

test("adjacent spots lower edge", () => {
  var a = MapUtil.get_adj([5, 9], 10, 10)
  expect(a.length).toBe(5);
});

test("adjacent spots left edge", () => {
  var a = MapUtil.get_adj([0, 5], 10, 10)
  expect(a.length).toBe(5);
});

test("adjacent spots right edge", () => {
  var a = MapUtil.get_adj([9, 5], 10, 10)
  expect(a.length).toBe(5);
});

