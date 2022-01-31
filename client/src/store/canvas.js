import { makeAutoObservable } from 'mobx'

class Canvas {
	canvas = null
	socket = null
	sessionID = null
	undoList = []
	redoList = []
	username = ''

	constructor() {
		makeAutoObservable(this)
	}

	setSocket(socket) {
		this.socket = socket
	}

	setSessionID(sessionID) {
		this.sessionID = sessionID
	}

	setUsername(username) {
		this.username = username
	}

	setCanvas(canvas) {
		this.canvas = canvas
	}

	pushToUndo(data) {
		this.undoList.push(data)
	}

	pushToRedo(data) {
		this.redoList.push(data)
	}

	undo() {
		let ctx = this.canvas.getContext('2d')
		if (this.undoList.length > 0) {
			let dataURL = this.undoList.pop()
			let img = new Image()

			this.redoList.push(this.canvas.toDataURL())

			img.src = dataURL
			img.onload = () => {
				ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
				ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
			}
		} else {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		}
	}

	redo() {
		let ctx = this.canvas.getContext('2d')
		if (this.redoList.length > 0) {
			let dataURL = this.redoList.pop()
			let img = new Image()

			this.undoList.push(this.canvas.toDataURL())

			img.src = dataURL
			img.onload = () => {
				ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
				ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
			}
		}
	}
}

export default new Canvas()