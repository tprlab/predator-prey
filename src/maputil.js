class MapUtil {
  static get_adj(p, W, H) {
    var ret = []
    var x = p[0]
    var y = p[1]
    for (var c = Math.max(0, x - 1); c <= Math.min(W - 1, x + 1); c++) {
      for (var r = Math.max(0, y - 1); r <= Math.min(H - 1, y + 1); r++) {  
        if (c == x && r == y)
          continue
        ret.push([c, r])
      }
    }
    return ret
  }
}

module.exports = {MapUtil}