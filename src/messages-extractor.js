const cheerio = require('cheerio')

const extractMessage = $message => {
  const pubdate = $message.find('time[pubdate]').attr('datetime')
  const title = $message.find('h2').text()
  const content = $message.find('.entry-content').text().replace(/\r\n/g, "")
  return {
    pubdateOriginal: pubdate,
    pubdate: pubdate.replace(/[^\d]/g, ''),
    title,
    content,
  }
}

const extractMessages = html => {
  const $ = cheerio.load(html)
  const $messages = $('article')
  return $messages.map((_, m) => extractMessage($(m))).get()
}

module.exports = {
  extractMessages,
}
