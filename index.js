const noble = require('@abandonware/noble');
const config = require('./config.json')
const pikabreak = require('./pikabreak')

noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    await noble.startScanningAsync([], true);
  }
});

noble.on('discover', async (peripheral) => {
  const beacon = getIbeaconInfo(peripheral)
  if (beacon) {
    // console.log(peripheral.id, peripheral.uuid, peripheral.rssi)
    // console.log(beacon)
    if (
      config.beacon.uuid === beacon.uuid &&
      config.beacon.major === beacon.major &&
      config.beacon.minor === beacon.minor
    ) {
      pikabreak.detectBeacon(peripheral)
    }
  }
});

const getIbeaconInfo = (peripheral) => {
  if ('manufacturerData' in peripheral.advertisement) {
    const manufacturerData = peripheral.advertisement.manufacturerData
    const APPLE_COMPANY_IDENTIFIER = 0x004c;
    const IBEACON_CODE = 0x1502
    if (manufacturerData) {
      if (
        APPLE_COMPANY_IDENTIFIER === manufacturerData.readInt16LE(0) &&
        IBEACON_CODE === manufacturerData.readInt16LE(2)
      ) {
        const uuid = manufacturerData.toString('hex').slice(8, 40)
        let formatedUuid = ''
        formatedUuid += uuid.slice(0, 8) + '-'
        formatedUuid += uuid.slice(8, 12) + '-'
        formatedUuid += uuid.slice(12, 16) + '-'
        formatedUuid += uuid.slice(16, 20) + '-'
        formatedUuid += uuid.slice(20, 32)

        const major = manufacturerData.readUInt16BE(20)
        const minor = manufacturerData.readUInt16BE(22)
        const signalPower = manufacturerData.readInt8(24)
        return {
          uuid: formatedUuid,
          major,
          minor,
          signalPower
        }
      } else {
        return null
      }
    }
  }
}