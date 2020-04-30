const {CruelWorld} = require('./src/cruel_world.js');

world = new CruelWorld(20, 20)
world.start()

for (i = 0; i < 50; i++) {
  world.next()
  world.status()
}
