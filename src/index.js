const path = require('path')
const fs = require('fs')
const { fetchMessages } = require('./messages-fetcher')
const { extractMessages } = require('./messages-extractor')
const { notifyToSlack } = require('./slack-notifier')

const KOBAKEN_MESSAGES_URL = 'http://kentarokobayashi.net/message'
const PUBDATE_FILE_PATH = path.resolve(__dirname, '..', '_last-pubdate')

const loadLastPubdate = () => {
  if (fs.existsSync(PUBDATE_FILE_PATH)) {
    return fs.readFileSync(PUBDATE_FILE_PATH).toString()
  }
  return null
}

const saveLatestPubdate = pubdate => {
  fs.writeFileSync(PUBDATE_FILE_PATH, pubdate)
}

const isNewMessage = (message, lastPubdate) => {
  if (lastPubdate == null) {
    return true  // XXX: What about first fetching?
  }
  return lastPubdate < message.pubdate
}

const run = env => {
  const lastPubdate = loadLastPubdate()

  fetchMessages(KOBAKEN_MESSAGES_URL).then(html => {
    const latestMessage = extractMessages(html)[0]

    if (isNewMessage(latestMessage, lastPubdate)) {
      saveLatestPubdate(latestMessage.pubdate)
      notifyToSlack(
        env.SLACK_HOOK_PATH,
        KOBAKEN_MESSAGES_URL,
        latestMessage
      )
    }
    else {
      console.log('No new message found.')
    }
  })
}

module.exports = { run }
