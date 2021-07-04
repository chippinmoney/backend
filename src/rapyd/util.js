const CryptoJS = require("crypto-js");
const http = require('http');
const https = require('https');

const getBodyString = body => {
  try {
    if (Object.keys(body).length == 0)
      return ''

    const body_string = JSON.stringify(body)
    return body_string
  } catch(e) { return '' }
}

const sendRequest = (config, requestType, url, body, onResult) => {
  const full_url = `https://sandboxapi.rapyd.net${url}`
  const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString()
  const salt = Date.now() + ''
  const http_method = requestType;
  const url_path = url
  const secret_key = config.secret_key
  const access_key = config.access_key
  const body_string = getBodyString(body)

  const to_sign = http_method + url_path + salt + timestamp + access_key + secret_key + body_string
  let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
  signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));
  
  const headers = {
    'content-type': 'application/json',
    'access_key': access_key,
    'salt': salt,
    'signature': signature,
    'timestamp': timestamp
  }

  const options = {
    host: 'sandboxapi.rapyd.net',
    port: 443,
    path: url_path,
    method: http_method,
    headers
  }
  const port = options.port == 443 ? https : http;

  const req = port.request(full_url, options, res => {
    let output = ''
    res.on('data', chunk => {
      output += chunk
    })

    res.on('end', () => {
      try {
        const obj = JSON.parse(output)
        onResult(res.statusCode, obj)
      } catch(e) {onResult(res.statusCode, output)}
    })
  })

  req.on('error', e => {
    onResult(500, e)
  })

  req.write(body_string)
  req.end()
}

module.exports = {
  sendRequest,
}