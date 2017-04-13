const marked = require('marked')

const read = (text) => {
  let i
  const content = text.split('\n').map(l => l.trim()).join('\n\n').trim()
  const pattern = /.*!\[(.*)\]\((.*)\)/
  const tokens = marked.lexer(content).map(t => {
    const result = pattern.exec(t.text)
    if (t.type === 'paragraph' && result) {
      t.alt = result[1]
      t.src = result[2]
      t.type = 'image'
    }
    return t
  })

  // title
  const title = (tokens[0].type === 'heading' && tokens[0].depth === 1) ? tokens.shift().text : null

  // cover
  let cover = null
  for (let i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'image' && tokens[i].alt === 'cover') {
      cover = tokens[i].src
      break
    }
  }

  // actions
  let actions = []
  let img
  let currentOptions
  i = 0
  for (let t of tokens) {
    const blockParseResult = /<!--\s*block\s*({.*})\s*-->/.exec(t.text)
    const endblockParseResult = /<!--\s*endblock\s*-->/.exec(t.text)
    if (t.type === 'html' && blockParseResult) {
      currentOptions = JSON.parse(blockParseResult[1])
      continue
    }
    if (t.type === 'html' && endblockParseResult) {
      currentOptions = null
      continue
    }
    if (t.type === 'image') {
      img = t
      continue
    }
    if (t.type === 'space') {
      continue
    }
    i += 1
    const singleActionParseResult = /.*<!--\s*({.*})\s*-->/.exec(t.text)
    const singleActionOptions = (singleActionParseResult) ? JSON.parse(singleActionParseResult[1]) : null
    if (singleActionParseResult) {
      t.text = t.text.split(/\s*<!--/)[0]
    }
    actions.push({
      id: i,
      img: img,
      text: t.text,
      options: singleActionOptions || currentOptions || {}
    })
  }
  return {
    title: title,
    cover: cover,
    actions: actions,
    length: actions.length
  }
}

export default {
  read: read
}
