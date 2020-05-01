var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//const {SafeWorld} = require('./src/safe_world.js');
const {CruelWorld} = require('./src/cruel_world.js');

 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});

const Width = 40
const Height = 20
const MaxTime = 800

io.on('connection', function (socket) {
  console.log('a user connected');

  msg = {"width" :Width, "height" : Height}
  socket.emit('info', JSON.stringify(msg))
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});


//world = new SafeWorld(Width, Height)
CruelWorld.WOLF_TIME = 100
world = new CruelWorld(Width, Height)
world.start()

setInterval(() => {
  if (world.T > CruelWorld.WOLF_TIME && world.preds_cnt == 0) {
    world = new CruelWorld(Width, Height)
    world.start()
  }
  if (world.T >= MaxTime) {
    world = new CruelWorld(Width, Height)
    world.start()
  }
  world.next()
  send_state()
}, 1000)



function send_state() {
  state = {"turn" :world.T, "map" : world.GM.get_vals()}
  io.emit('state', JSON.stringify(state))
}