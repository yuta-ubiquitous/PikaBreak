const noble = require('@abandonware/noble');
const config = require('./config.json')

class PikaBreak {

  state = 'stop'
  packets = []
  timestamps = []

  constructor() {
    console.log('PikaBreak Class')
  }

  discoveredBeacon(_peripheral){
    if(this.state === 'stop'){
      this.state = 'found'
      this.packets.push(_peripheral)
      const t = new Date().getTime()
      this.timestamps.push(t)

      // timer start
      this.startTimer()
    }
    else if(this.state === 'found'){
      this.packets.push(_peripheral)
      const t = new Date().getTime()
      this.timestamps.push(t)
    }
  }

  async startTimer() {
    setTimeout(()=>{
      console.log(this.timestamps)

      this.timestamps = []
      this.packets = []
      this.state = 'stop'
    }, 5000)
  }
}

const pika = new PikaBreak()

noble.on('stateChange', async (state) => {
  console.log('state:', state)
  if (state === 'poweredOn') {
    await noble.startScanningAsync([], true);
  }
});

noble.on('discover', async (peripheral) => {
  if(peripheral.uuid === config.uuid){
    console.log(peripheral.id, peripheral.rssi)
    console.log(peripheral.advertisement)
    pika.discoveredBeacon(peripheral)
  }
});

