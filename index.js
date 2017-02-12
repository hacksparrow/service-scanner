var os = require('os')
var request = require('request')
var hostsFound = 0

module.exports = function (options) {

  var limit = options.limit || 1
  var port = options.port || 80
  var path = options.path || '/'
  var signature = options.signature || ''
  var scanInterval = options.scanInterval || 10
  var requestTimeout = options.requestTimeout || 10
  var foundCallback = options.found
  var notFoundCallback = options.notFound
  var scanCompleteCallback = options.scanComplete

  var startIp = options.startIp
  var startIpArray = startIp ? startIp.split('.') : null
  var endIp = options.endIp
  var endIpArray = endIp ? endIp.split('.') : null

  // currently supports only Class C networks
  var localIPadd = os.networkInterfaces().en1[1].address
  var ipArray = localIPadd.split('.')
  ipArray[2] = startIpArray ? +startIpArray[2] : 0
  ipArray[3] = startIpArray ? +startIpArray[3] :  0

  var maxNum2 = endIpArray ? +endIpArray[2] : 255
  var maxNum3 = endIpArray ? +endIpArray[3] : 255

  var timer = setInterval(function () {

    if (limit === hostsFound) {
      clearInterval(timer)
      return scanCompleteCallback && scanCompleteCallback()
    }

    var ip = ipArray.join('.')
    scan(requestTimeout, limit, ip, port, path, signature, foundCallback, notFoundCallback, scanCompleteCallback)

    if (ipArray[2] === maxNum2 && ipArray[3] === maxNum3) {
      clearInterval(timer)
      return scanCompleteCallback && scanCompleteCallback()
    }

    if (ipArray[3] === 255) {

      ipArray[2]++
      ipArray[3] = 0

    } else {

      ipArray[3]++

    }

  }, scanInterval)

}

function scan(requestTimeout, limit, ip, port, path, signature, foundCallback, notFoundCallback, scanCompleteCallback) {

  var url = 'http://' + ip + ':' + port + path
  var options = {
    url: url,
    timeout: requestTimeout
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      if (Array.isArray(signature)) {

        signature.forEach(function(sigStr) {
          if (body.indexOf(sigStr) === 0) {
            hostsFound++
            return foundCallback && foundCallback(ip)
          }
        })

      } else if (body.indexOf(signature) === 0) {
        hostsFound++
        return foundCallback && foundCallback(ip)
      }
    } else {
      return notFoundCallback && notFoundCallback(ip)
    }
  })

}
