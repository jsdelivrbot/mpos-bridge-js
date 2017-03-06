import { merge } from 'ramda'
import cuid from 'cuid'
import Bluebird from 'bluebird'
import { EventEmitter } from 'events'
import { w3cwebsocket as WS } from 'websocket'

function open (config) {
  const socket = new WS(config.endpoint, 'mpos-bridge')
  const callbacks = {}
  const events = new EventEmitter()

  function registerCallback (commandId, callback) {
    callbacks[commandId] = callback
  }

  function deregisterCallback (commandId) {
    delete callbacks[commandId]
  }

  function send (request, options) {
    const finalOptions = merge({
      waitForResponse: true,
    }, options)

    const fullRequest = merge({
      context: finalOptions.context,
      command_id: cuid(),
    }, request)

    const payload = JSON.stringify(fullRequest)

    return new Bluebird((resolve, reject) => {
      if (finalOptions.waitForResponse) {
        registerCallback(fullRequest.command_id, (result) => {
          if (result.success === true) {
            resolve(result.response)
          } else {
            reject(result.error)
          }
        })
      }

      socket.send(payload)

      if (!finalOptions.waitForResponse) {
        resolve()
      }
    })
  }

  socket.addEventListener('error', (error) => {
    events.emit('error', error)
  })

  socket.addEventListener('open', () => {
    events.emit('ready')
  })

  socket.addEventListener('message', (data) => {
    const message = JSON.parse(data.data)

    if (message.command) {
      const callback = callbacks[message.command_id]

      if (callback) {
        deregisterCallback(message.command_id)
        callback(message)
      }
    } else if (message.event) {
      events.emit(message.event, message)
    }
  })

  socket.addEventListener('close', () => {
    events.emit('close')
  })

  return {
    config,
    send,
    events,
  }
}

export default { open }

