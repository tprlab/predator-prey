class GeoMap {
  hash = {}

  add(u) {
    if (this.hash[u.point]) {
      var v = this.hash[u.point]
      console.log("Cannot add", u.id, "to", u.point, " - taken by", v)
      return false
    }
    this.hash[u.point] = u
    return true
  }

  move(old_spot, new_spot) {
    if (!this.hash[old_spot]) {
      console.log("Cannot move from", old_spot, this.hash)
      return false
    }
    if (this.hash[new_spot]) {
      console.log("Cannot move to", new_spot)
      return false
    }

    var v = this.hash[old_spot]
    this.hash[new_spot] = v
    delete this.hash[old_spot]
    return true
  }

  remove(p) {
    if (!this.hash[p]) {
      console.log("Cannot remove from", p)
      return false
    }
    delete this.hash[p]
    return !this.hash[p]
  }

  get(p) {
    return this.hash[p]
  }

  get_vals() {
    return Object.values(this.hash)
  }

  get_points() {
    return Object.keys(this.hash)
  }

}

module.exports = {GeoMap}