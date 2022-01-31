const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
	ws.on('message', (message) => {
		message = JSON.parse(message)
		switch (message.method) {
			case 'connection':
				connectionHandler(ws, message)
				break
			case 'draw':
				broadcastConnection(ws, message)
				break
		}
	})
})

app.post('/image', (req, res) => {
	try {
		const data = req.body.img.replace('data:image/png;base64,', '')
		fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
		return res.status(200).json({ message: 'Image loaded' })
	} catch (err) {
		console.log(err)
		return res.status(500).json('error')
	}
})
app.get('/image', (req, res) => {
	try {
		const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
		const data = 'data:image/png;base64,' + file.toString('base64')
		return res.status(200).json(data)
	} catch (err) {
		console.log(err)
		return res.status(500).json('error')
	}
})

const connectionHandler = (ws, msg) => {
	ws.id = msg.id
	broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
	aWss.clients.forEach(client => {
		if (client.id === msg.id) {
			client.send(JSON.stringify(msg))
		}
	})
}

app.listen(PORT, () => console.log('Server is running on port ', PORT))
