class ViewSettings {
  static CLR_BK = "green"
  static CLR_DEER = "goldenrod"
  static CLR_WOLF = "gray"
  static CLR_BK_CHART = "lightgray"
  static CLR_TEXT = "black"
  static CLR_LINE_DEER = "red"
  static CLR_LINE_WOLF = "blue"
  static FONT_TEXT = "20px Times New Roman"
}


class Wilds {
  static DEER = 1
  static WOLF = 2
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
    if (this.data.length > 0 && this.data[0].length > 0) {
      var idx = this.data[0].length - 1
      var last_d = this.data[0][idx]
      var last_w = this.data[1][idx]
      var txt = "Time: " + last_d.x + ", deers: " + last_d.y + ", wolves: " + last_w.y
      ctx.fillText(txt, this.R.x + this.R.width / 2, this.R.y + this.R.height / 5);
    }

    this.draw_line(ctx, this.data[0], ViewSettings.CLR_LINE_DEER)
    this.draw_line(ctx, this.data[1], ViewSettings.CLR_LINE_WOLF)

    if (Math.abs(this.minY - this.R.y) < 5)
      this.ymax += this.ymax / 10
  }

  draw_line(ctx, data, clr) {
    ctx.strokeStyle = clr
    ctx.lineWidth = 2
    ctx.beginPath();
    var p0 = data[0]
    this.minY = this.getLineY(p0.y)
    ctx.moveTo(this.getLineX(p0.x), this.minY)
    data.forEach(p => ctx.lineTo(this.getLineX(p.x), this.getLineY(p.y))) 
    ctx.stroke();
  }

  add_data(t, v, p) {
    if (this.data.length < 1) {
      this.data[0] = []
      this.data[1] = []
    }
    this.data[0].push({x : t, y : v})
    this.data[1].push({x : t, y : p})
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

  draw_herd(ctx, data, kind, clr) {
    var herd = data.filter(a => a.kind == kind)
    var q = this.Q
    var q2 = q / 2

    ctx.fillStyle = clr
    ctx.beginPath();
    herd.forEach(a => {
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

  draw_objects(ctx, data) {
    if (!data)
      return

    this.draw_herd(ctx, data, Wilds.DEER, ViewSettings.CLR_DEER)
    this.draw_herd(ctx, data, Wilds.WOLF, ViewSettings.CLR_WOLF)
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

      var preds = self.state.map.filter(a => a.kind == Wilds.WOLF)
      self.view.chart.add_data(self.state.turn, self.state.map.length - preds.length, preds.length)
      self.view.redraw()
      self.lastTurn = self.state.turn
      //if (self.lastTurn % 100 == 0)
      //    document.getElementById('download').click()
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