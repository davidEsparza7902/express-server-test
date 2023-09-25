const express = require('express')
const cors = require('cors')
const app = express()
// In order to get the body content of the request
app.use(express.json())
app.use(cors())

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}
app.use(requestLogger)
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0
  return maxId + 1
}

// Test
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

// GET all Notes
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

// GET a Note
app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((n) => n.id === id)
  if (note) res.json(note)
  else res.status(404).end()
})

// DELETE a Note
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

// CREATE a Note
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing :P',
    })
  }
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }
  notes = notes.concat(note)
  response.json(note)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
