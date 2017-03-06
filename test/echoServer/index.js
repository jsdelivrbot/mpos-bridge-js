import http from 'http'
import { server as WebSocketServer } from 'websocket'

const server = http.createServer((request, response) => {
})

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
})

const port = process.env.PORT

process.title = 'echoServer'

wsServer.on('request', (request) => {
  const connection = request.accept('mpos-bridge', request.origin);

  connection.on('message', (data) => {
    let dataStr

    if (data.type === 'utf8') {
      dataStr = data.utf8Data
    } else {
      dataStr = data.binaryData.toString('utf8')
    }

    const message = JSON.parse(dataStr)

    const response = {
      command: message.command,
      command_id: message.command_id,
      context: message.context,
      success: true,
      response: message,
    }

    connection.sendUTF(JSON.stringify(response))
  })
})

server.listen(port, () =>
  console.log(`Server started in port ${port}`))

process.on('SIGINT', () => process.exit(0))

