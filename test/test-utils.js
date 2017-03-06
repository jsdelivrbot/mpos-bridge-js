import { merge } from 'ramda'
import mposBridge from '../dist/mpos-bridge'

function create (options) {
  return mposBridge.client.connect(merge(options, {
    endpoint: 'ws://localhost:2222/bridge',
  }))
}

export default { create }

