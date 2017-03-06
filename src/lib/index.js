import { merge, map } from 'ramda'
import protocol from './protocol'
import commands from './commands'

/**
 * Binds the `options` received as param
 * to the client's resources.
 * @private
 *
 * @param {Object} options
 * @returns A version of resources with its methods' first param binded to `options`
 */
function bindOptions (options) {
  const mapper = (val) => {
    if (typeof val === 'object') {
      return map(mapper, val)
    }

    return val.bind(null, options)
  }

  return map(mapper, commands)
}

/**
 * Connects to the given endpoint.
 *
 * @example
 * bridge.client.connect({ endpoint: 'ws://localhost:2222', encryptionKey: 'ek_test_89jd3dj2ijd0sai' })
 *
 * @param {Object} options
 * @returns {Promise} A Promise that resolves to the client instance
 */
function connect (options) {
  return protocol
    .open(options)
    .then(bindOptions)
}

const client = merge({ connect }, commands)

export default client

