const scan = require('./')
const options = {
  port: 3000,
  path: '/secret',
  startIp: '192.168.0.1',
  endIp: '192.168.0.255',
  signature: ['apple', 'secret-app'],
  found: function(ip) {
    console.log('FOUND:', ip)
  },
  scanComplete: function() {
    console.log('Scan completed!')
  }
}

scan(options)
