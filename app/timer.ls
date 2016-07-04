Timer = (element) !->
  this.element = element
  this.counter = null
  this.elapsed = 0

Timer.prototype.run = !->
  this.timestamp = new Date!getTime!
  (self = this).counter := set-interval ->
    timestamp = new Date!getTime!
    self.elapsed += timestamp - self.timestamp
    self.timestamp = timestamp
    self.update-timer!
  , 1000

Timer.prototype.stop = !->
  this.elapsed += new Date!getTime! - this.timestamp
  this.update-timer!
  clear-interval this.counter

Timer.prototype.reset = !->
  this.elapsed = 0

Timer.prototype.update-timer = !->
  t = parseInt this.elapsed / 1000
  minutes = (\0 + parse-int(t / 60).to-string!).slice -2
  seconds = (\0 + (t % 60).to-string!).slice -2
  document.get-element-by-id this.element .innerHTML = "#minutes:#seconds"

module.exports = Timer
