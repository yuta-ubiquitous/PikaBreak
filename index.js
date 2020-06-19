const noble = require('@abandonware/noble');
const config = require('./config.json')
const pikabreak = require('./pikabreak')

noble.on('stateChange', async (state) => {
  console.log('state:', state)
  if (state === 'poweredOn') {
    await noble.startScanningAsync([], true);
  }
});

noble.on('discover', async (peripheral) => {
  if(peripheral.uuid === config.uuid){
    // console.log(peripheral.id, peripheral.rssi)
    // console.log(peripheral.advertisement)
    // pika.discoveredBeacon(peripheral)
    pikabreak.detectBeacon(peripheral)
  }
});