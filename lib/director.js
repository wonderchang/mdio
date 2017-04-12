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
  i = 0
  for (let t of tokens) {
    if (t.type === 'image') {
      img = t
    } else {
      i += 1
      actions.push({
        id: i,
        img: img,
        text: t.text
      })
    }
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
