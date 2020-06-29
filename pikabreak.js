const { execSync } = require('child_process')

class PikaBreak {
  // public
  state = 'stop' // stop-fing-work
  findingDuration = 60 * 1000 // [msec]
  checkDuration = 5 * 60 * 1000 // [msec]
  lightCycle = 6
  lightEmphasisCycle = this.lightCycle * 3
  lightDuration = 10 * 1000 // [msec]

  // private
  _peripherals = []
  _timestamps = []
  _workCycleCount = 0

  constructor() {
    // console.log('PikaBreak Class')
    this._lightOff()
    console.log('state:', this.state)
  }

  detectBeacon(_peripheral) {
    if (this.state === 'stop') {
      this.state = 'find'
      console.log('state:', this.state)
      this._peripherals.push(_peripheral)
      const t = new Date().getTime()
      this._timestamps.push(t)

      // timer start
      setTimeout(() => {
        // console.log(this._timestamps)
        if (this._numberOfPackets() > 1) {
          this.state = 'work'
          this._timestamps = []
          this._peripherals = []
          this._light()
          this._runWorking()
        } else {
          this._timestamps = []
          this._peripherals = []
          this.state = 'stop'
          console.log('state:', this.state)
        }
      }, this.findingDuration)

    }
    else if (this.state === 'find') {
      this._peripherals.push(_peripheral)
      const t = new Date().getTime()
      this._timestamps.push(t)
    } else if (this.state === 'work') {
      this._peripherals.push(_peripheral)
      const t = new Date().getTime()
      this._timestamps.push(t)
    }
  }

  _runWorking() {
    console.log('workCycle:', this._workCycleCount)
    const workCycle = () => {
      this._workCycleCount += 1
      if (this._numberOfPackets() > 0) {
        this._timestamps = []
        this._peripherals = []

        console.log('workCycle:', this._workCycleCount)
        if(this._workCycleCount % this.lightEmphasisCycle === 0){
          this._light_emphasis()
        }
        else if (this._workCycleCount % this.lightCycle === 0) {
          this._light()
        }
        setTimeout(workCycle, this.checkDuration)
      } else {
        this._workCycleCount = 0
        this.state = 'stop'
        console.log('state:', this.state)
        // console.log(this.state)
      }
    }
    setTimeout(workCycle, this.checkDuration)
  }

  _numberOfPackets() {
    return this._peripherals.length
  }

  _lightOnAsync() {
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        this._lightOn()
        resolve('on')
      }, this.lightDuration)
    })
  }

  _lightOffAsync() {
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        this._lightOff()
        resolve('off')
      }, this.lightDuration)
    })
  }
  
  _light_emphasis(){
    Promise.resolve()
    .then(()=>{
      return new Promise((resolve, reject)=>{
        this._lightOn()
        resolve('init')
      })
    })
    .then(v=>{
      return this._lightOffAsync()
    })
    .then(v=>{
      return this._lightOnAsync()
    })
    .then(v=>{
      return this._lightOffAsync()
    })
    .then(v=>{
      return this._lightOnAsync()
    })
    .then(v=>{
      return this._lightOffAsync()
    })
    .catch(err=>{
      console.error(err)
    })
  }

  _light() {
    this._lightOn()
    setTimeout(() => {
      this._lightOff()
    }, this.lightDuration)
  }

  _lightOn() {
    try{
      execSync('sudo sh -c "echo -n \\"1-1\\" > /sys/bus/usb/drivers/usb/bind"')
      console.log('light--ON--')
    }catch(err){
      console.error('can not light on')
    }
  }

  _lightOff() {
    try{
      execSync('sudo sh -c "echo -n \\"1-1\\" > /sys/bus/usb/drivers/usb/unbind"')
      console.log('light--OFF--')
    }catch(err){
      console.error('can not light off')
    }
  }
}

module.exports = new PikaBreak()