const fetch = require('isomorphic-fetch')

const fetchMessages = url => {
  return fetch(url).then(res => res.text())
}

module.exports = {
  fetchMessages,
}
