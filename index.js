require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })
  next(error)
}

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)
app.use(errorHandler)

// GET all Notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (error) {
    console.log(error)
  }
})

// GET a Note
app.get('/api/notes/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note) res.json(note)
    else res.status(404).end()
  } catch (e) {
    next(e)
  }
})

// CREATE a Note
app.post('/api/notes', async (request, response, next) => {
  try {
    const body = request.body

    if (body.content === undefined) {
      return response.status(400).json({
        error: 'content missing :P',
      })
    }

    const note = new Note({
      content: body.content,
      important: body.important || false,
    })

    const savedNote = await note.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
    /* response.status(500).json({ error: 'Internal Server Error' }) */
  }
})

// DELETE a Note
app.delete('/api/notes/:id', async (request, response, next) => {
  try {
    const note = await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (e) {
    next(e)
  }
})

// EDIT a note
app.put('/api/notes/:id', async (request, response, next) => {
  try {
    const { content, important } = request.body

    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      { content, important },
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedNote)
  } catch (error) {
    next(error)
  }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
