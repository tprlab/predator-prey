class ViewSettings {
  static CLR_BK = "green"
  static CLR_DEER = "goldenrod"
  static CLR_BK_CHART = "lightgray"
  static CLR_TEXT = "black"
  static CLR_LINE = "red"
  static FONT_TEXT = "30px Times New Roman"
}

class ChartView {

  data = []

  init_size(R, ymax) {
    this.R = R
    this.ymax = ymax
    console.log(ymax)
  }

  redraw(ctx) {
    ctx.fillStyle = ViewSettings.CLR_BK_CHART
    if (!this.R)
      return
    ctx.fillRect(this.R.x, this.R.y, this.R.width, this.R.height);    
    ctx.fillStyle = ViewSettings.CLR_TEXT
    ctx.font = ViewSettings.FONT_TEXT
    if (this.data.length > 0) {
      var last = this.data[this.data.length - 1]
      var txt = "Time: " + last.x + ", deers: " + last.y
      ctx.fillText(txt, this.R.x + this.R.width / 2, this.R.y + this.R.height / 5);
    }

    ctx.strokeStyle = ViewSettings.CLR_LINE
    ctx.lineWidth = 2
    ctx.beginPath();
    var p0 = this.data[0]
    this.minY = this.getLineY(p0.y)
    ctx.moveTo(this.getLineX(p0.x), this.minY)
    this.data.forEach(p => ctx.lineTo(this.getLineX(p.x), this.getLineY(p.y))) 
    ctx.stroke();

    if (Math.abs(this.minY - this.R.y) < 5)
      this.ymax += this.ymax / 10
  }

  add_data(t, v) {
    this.data.push({x : t, y : v})
  }

  getLineX(x) {
    return this.R.x + x
  }
  getLineY(y) {
    var ret = this.R.y + this.R.height - Math.max(y * this.R.height / this.ymax, 2)
    //console.log(y, ret)
    this.minY = Math.min(this.minY, ret)
    return ret
  }

  clear() {
    this.data = []
  }
}

class PredPreyView {

  constructor(canvas, rect) {
    this.canvas = canvas
    this.R = rect
    this.chart = new ChartView()
  }

  redraw() {
    var ctx = this.canvas.getContext("2d")
    ctx.fillStyle = ViewSettings.CLR_BK
    if (this.R)
      ctx.fillRect(this.R.x, this.R.y, this.R.width, this.R.height);    
    this.draw_objects(ctx, this.data)
    this.chart.redraw(ctx)
  }

  set_data(data) {
    this.data = data
  }

  init_size(w, h, chart_ymax) {
    this.Q = Math.min(this.R.width / w, this.R.height / h) 
    this.W = w * this.Q
    this.H = h * this.Q
    this.chart.init_size({x :0, y : this.H, width : this.W, height : this.R.height - this.H}, chart_ymax)
  }

  draw_objects(ctx, data) {
    if (!data)
      return
    var q = this.Q
    var q2 = q / 2

    ctx.fillStyle = ViewSettings.CLR_DEER
    ctx.beginPath();
    data.forEach(a => {
      var x = a.point[0]
      var y = a.point[1]
      var cx = q * x + q2
      var cy = q * y + q2
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, q2, 0, 2 * Math.PI)
    });
    ctx.closePath()
    ctx.fill()

  }
}

class PredPreyCtrl {
  lastTurn = 0

  constructor(view) {
    this.view = view
    this.socket = io();
    var self = this
    this.socket.on('state', function(msg){
      self.state = JSON.parse(msg)
      if (!self.state)
        return
      if (self.state.turn < self.lastTurn) {
        self.view.chart.clear()
      }
      self.view.set_data(self.state.map)
      self.view.chart.add_data(self.state.turn, self.state.map.length)
      self.view.redraw()
      self.lastTurn = self.state.turn
      //document.getElementById('download').click()
    })

    this.socket.on('info', function(msg){
      var info = JSON.parse(msg)
      var chart_scale = info.width * info.height / 2 
      chart_scale += chart_scale / 10
      self.view.chart.clear()
      self.view.init_size(info.width, info.height, chart_scale)
    });

  }

}