import { merge } from 'ramda'

function standardCommand (name) {
  return (protocol, args, options) => {
    const command = merge({
      command: name,
    }, args)

    return protocol.send(command, options)
  }
}

const listDevices = standardCommand('list_devices')

const status = standardCommand('status')

const processPayment = standardCommand('process_payment')

const finishPayment = standardCommand('finish_payment')

function initialize (protocol, args, options) {
  const command = merge({
    command: 'initialize',
    encryption_key: protocol.config.encryption_key,
  }, args)

  return protocol.send(command, options)
}

export default {
  listDevices,
  initialize,
  status,
  processPayment,
  finishPayment,
}

