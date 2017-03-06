const mposBridge = require('pagarme-mpos-bridge')

const bridge = mposBridge.client.connect({
  endpoint: 'ws://localhost:2222/bridge',
  encryptionKey: 'ek_test_y7jk294ynbzf93',
})

bridge.listDevices()
  .then(devices => bridge.initialize({ device_id: devices.devices[0].id }))
  .then(() => bridge.processPayment({ amount: 1000 }))
  .then((result) => makePayment(result.card_hash))
  .tap((result) => bridge.finishPayment({ emv_data: result.emv_data }))


