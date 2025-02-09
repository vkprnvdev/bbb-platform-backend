import express from 'express'

import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'

const app = express()
const port = process.env.PORT || 4200

app.use(express.json())

app.use('/user', userRouter)
app.use('/auth', authRouter)

app.get('/ping', (req, res) => {
	res.json({ message: 'pong' }).status(200)
})

app.listen(port, () => {
	console.log(`Server up and running on port: ${port}`)
})
