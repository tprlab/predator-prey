const {SafeWorld} = require('./src/safe_world.js');

world = new SafeWorld(20, 20)
world.start()

for (i = 0; i < 100; i++) {
  world.next()
  world.status()
}
