import path from 'path'
import url from 'url'
import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import mime from 'mime'

import connectDB from './database/connect.js'
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'

dotenv.config()

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/post', postRoutes)
app.use('/api/v1/dalle', dalleRoutes)
app.use('/assets', express.static('public', {
    setHeaders: (res, path) => {
        if (mime.getType(path) === 'text/css') {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
}

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

const startServer = async () => {

    try {
        connectDB(process.env.MONGODB_URL)
        app.listen(8080, () => console.log('Server listening on port http://localhost:8080'))
    } catch (error) {
      console.log(error)
    }

}

startServer()