class Wild {
  static id_cnt = 1

  id = 0
  point = [0, 0]
  kind = 0

  constructor(kind) {
    this.kind = kind
    this.id = Wild.id_cnt++
  }

  move(p) {
    this.point = p
  }
}

module.exports = {Wild};