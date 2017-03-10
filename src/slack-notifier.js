const https = require('https')

const notifyToSlack = (hookPath, url, message) => {
  const req = https.request({
    hostname: 'hooks.slack.com',
    port: 443,
    path: hookPath,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    }
  }, res => {
    if (res.statusCode >= 300) {
      console.error('Bad response:', res.statusCode, res)
    }
  })

  req.on('error', err => {
    console.error('ERROR ON NOTIFICATION', err)
  })

  req.write(JSON.stringify({
    username: 'kobaken-bot',
    icon_emoji: ':tophat:',
    text: `小林賢太郎の新着メッセージ: <${url}|${message.title}>`
  }))
  req.end()
}

module.exports = {
  notifyToSlack,
}
