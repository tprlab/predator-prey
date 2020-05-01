const {CruelWorld} = require('./src/cruel_world.js');

world = new CruelWorld(20, 20)
world.start()

CruelWorld.WOLF_TIME = 100

for (i = 0; i < 1000; i++) {
  world.next()
  world.status()
  if (world.T > CruelWorld.WOLF_TIME && world.preds_cnt == 0)
    break
}
