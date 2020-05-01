const {Wilds, SafeWorld} = require('./safe_world.js');
const {MapUtil} = require('./maputil.js');
const {Wild} = require('./wild.js');
const _ = require('lodash');


class CruelWorld extends SafeWorld {

  static WOLF_TIME = 20
  static HUNGER_TIME = 1
  
  preds_cnt = 0
  feed_table = {}

  add_predator() {
    var spots = MapUtil.get_adj([this.W/2, this.H/2], this.W, this.H)
    if (!spots) {
      console.log("No place for predator")
      return false
    }
    var free = spots.filter(p => !this.GM.get(p))
    if (free.length < 1) {
      console.log("Too crowdy for predator")
      return false
    }

    var spot = _.sample(free)
    var pred = new Wild(Wilds.WOLF)
    pred.move(spot)
    this.add_wild(pred)
  }

  next() {
    this.starved = []
    this.hunted = []
    super.next()
    if (this.T == CruelWorld.WOLF_TIME)
      this.add_predator()

    this.starved.forEach(p => this.remove_wild(p))
    this.hunted.forEach(p => this.remove_wild(p))
    console.log(this.T, "hunted", this.hunted.length, ",starved:" , this.starved.length)
    var preds = this.GM.get_vals().filter(c => c.kind == Wilds.WOLF)
    console.log(this.T, ": population", this.GM.get_points().length, "predators", preds.length)
    this.preds_cnt = preds.length


  }

  roam_wild(u) {
    var rc = super.roam_wild(u)
    if (!rc)
      return rc
    if (u.kind == Wilds.DEER)
      return rc
    this.hunt(u)
    return rc
  }

  hunt(pred) {
    var fed = this.feed_table[pred.id]
    if (fed) {
      if (fed < 0)
        fed = -fed

      if (this.T - fed < CruelWorld.HUNGER_TIME)
        return
    } else {
      fed = this.T
      this.feed_table[pred.id] = -fed
    }

    var spots = MapUtil.get_adj(pred.point, this.W, this.H)
    var preys = spots.map(p => this.GM.get(p)).filter(u => u && u.kind == Wilds.DEER)
                                                        
    //console.log("Have", preys.length, "preys for ", pred)
    if (!preys || preys.length < 1) {
      if (this.T - fed > 2 * CruelWorld.HUNGER_TIME) {
        this.starved.push(pred)
        //console.log("Predator", pred, "starved, last fed:", fed)
        delete this.feed_table[pred.id]
      }
      return
    }

    var prey = _.sample(preys)
    this.hunted.push(prey)
    this.feed_table[pred.id] = this.T
  }

  breed(u) {
    if (u.kind == Wilds.DEER)
      return super.breed(u)
    var fed = this.feed_table[u.id]
    if (!fed || fed < 0)
      return false
    if (this.T - fed > CruelWorld.HUNGER_TIME)
      return false

    var spots = MapUtil.get_adj(u.point, this.W, this.H)
    if (!spots || spots.length < 1) {
      //console.log("No place to breed", u)
      return false
    }
    var preys = spots.map(p => this.GM.get(p)).filter(u => u && u.kind == Wilds.DEER)
    var preds = spots.map(p => this.GM.get(p)).filter(u => u && u.kind == Wilds.WOLF)

    if (preys.length < 1 || preds.length > 0)
      return false
    spots = spots.filter(p => !this.GM.get(p))
    var spot = _.sample(spots)
    if (!spot)
      return false


    var born = new Wild(u.kind)
    born.move(spot)
    this.add_wild(born)
    //console.log("Born", born.id, "by", u.id, "on", this.T)
    this.born.push(born)
    return true
  }
}

module.exports = {CruelWorld}