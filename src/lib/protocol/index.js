import { merge } from 'ramda'
import cuid from 'cuid'
import Bluebird from 'bluebird'
import { EventEmitter } from 'util'

function open (config) {
  const callbacks = {}
  const events = new EventEmitter()
  const socket = new WebSocket(config.endpoint)

  function registerEventHandler (event, handler) {
    events.addListener(event, handler)
  }

  function removeEventHandler (event, handler) {
    events.removeListener(event, handler)
  }

  function registerCallback (commandId, callback) {
    callbacks[commandId] = callback
  }

  function deregisterCallback (commandId) {
    delete callbacks[commandId]
  }

  function fireProtocolError (error) {
    events.emit('error', error)
  }

  function send (request, options) {
    const finalOptions = merge({
      waitForResponse: true,
    }, options)

    const fullRequest = merge({
      context: finalOptions.context,
      command_id: cuid(),
    }, request)

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

      socket.send(fullRequest)

      if (!finalOptions.waitForResponse) {
        resolve()
      }
    })
  }

  function create (resolve, reject) {
    let resolved = false

    const instance = {
      config,
      send,
      registerEventHandler,
      removeEventHandler,
    }

    socket.addEventListener('error', (error) => {
      resolved = true

      if (resolved) {
        fireProtocolError(error)
      } else {
        reject(error)
      }
    })

    socket.addEventListener('open', () => {
      if (resolved) {
        return
      }

      resolved = true

      resolve(instance)
    })

    socket.addEventListener('message', (data) => {
      const message = JSON.parse(data)

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
  }

  return new Bluebird(create)
}

export default { open }

