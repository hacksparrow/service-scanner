# service-scanner

Scan for services in a network of IP addresses. Currently supports only HTTP services on a Class C network.

## Usage

```js
const scan = require('service-scanner')
const options = { ... }

scan(options)
```

The `options` object can have the following properties:

1. `limit`: Number of hosts to find before stopping the scan. Defaults to `1`.
2. `port`: Port number to connect at. Defaults to 80.
3. `path`: Path where to look for the signature. Defaults to `/`.
4. `startIp`: IP Address to start scanning from (inclusive). Defaults to `192.168.0.0`.
5. `endIp`: IP Address to stop scanning at (inclusive). Defaults to `192.168.255.255`.
6. `signature`: String or array of possible strings returned by the service when requested at `path`. Defaults to an empty string.
7. `scanInterval`: How fast to scan. Defaults to `10` (ms).
8. `requestTimeout`: How long to wait till a request to the service timesout. Defaults to `10` (ms).
9. `found`: Function to execute when a service is found - optional.
10. `notFound`: Function to execute when a service was not found on a host - optional.
11. `scanComplete`: function to execute when the scan is completed - optional.

**Example**

```js
const scan = require('service-scanner')
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
```

## [LICENSE](LICENSE)
