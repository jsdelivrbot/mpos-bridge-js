import testUtils from '../../../test/test-utils'

test('protocol.open', (done) => {
  const bridge = testUtils.create({
    encryptionKey: 'ek_test_sad930je32',
  })

  bridge.events.on('ready', () => done())
  bridge.events.on('error', (error) => done(error))
})

test('protocol.send', (done) => {
  const bridge = testUtils.create({
    encryptionKey: 'ek_test_sad930je32',
  })

  bridge.events.on('error', (error) => done(error))

  bridge.events.on('ready', () => {
    bridge.send({
      command: 'test',
      test: '123',
    })
      .then((response) => {
        expect(response.test).toBe('123')
      })
      .then(() => done())
  })
})
