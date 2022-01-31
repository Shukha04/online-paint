import '../styles/canvas.scss'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import canvasState from '../store/canvas'
import toolsState from '../store/tools'
import Brush from '../tools/Brush'
import Rect from '../tools/Rect'
import axios from 'axios'

const Canvas = observer(() => {
	const canvasRef = useRef()
	const usernameRef = useRef()
	const params = useParams()

	const [modal, setModal] = useState(true)

	useEffect(() => {
		canvasState.setCanvas(canvasRef.current)
		axios.get(`http://localhost:3001/image?id=${params.id}`).then(res => {
			const img = new Image()
			img.src = res.data
			img.onload = () => {
				canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
				canvasRef.current.getContext('2d').drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
			}
		})
	}, [])

	useEffect(() => {
		if (canvasState.username) {
			const socket = new WebSocket('ws://localhost:3001/')
			canvasState.setSocket(socket)
			canvasState.setSessionID(params.id)
			toolsState.setTool(new Brush(canvasRef.current, socket, params.id))

			socket.onopen = () => {
				socket.send(JSON.stringify({
					id: params.id,
					username: canvasState.username,
					method: 'connection'
				}))
			}

			socket.onmessage = e => {
				let msg = JSON.parse(e.data)
				switch (msg.method) {
					case 'connection':
						console.log(`User ${msg.username} is connected.`)
						break
					case 'draw':
						drawHandler(msg)
						break
				}
			}
		}
	}, [canvasState.username])

	const drawHandler = (msg) => {
		const tool = msg.tool
		const ctx = canvasRef.current.getContext('2d')
		switch (tool.type) {
			case 'brush':
				Brush.draw(ctx, tool.x, tool.y)
				break
			case 'rect':
				Rect.staticDraw(ctx, tool.x, tool.y, tool.w, tool.h, tool.color)
				break
			case 'finish':
				ctx.beginPath()
				break
		}
	}

	const mouseDownHandler = () => {
		canvasState.pushToUndo(canvasRef.current.toDataURL())
	}

	const mouseUpHandler = () => {
		axios.post(`http://localhost:3001/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
				 .then(res => console.log(res.data.message))
	}

	const connectHandler = () => {
		canvasState.setUsername(usernameRef.current.value)
		setModal(false)
	}

	return (
		<div className='canvas'>
			<Modal show={modal} onHide={() => {}}>
				<Modal.Header closeButton>
					<Modal.Title>Type your name</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input type='text' ref={usernameRef} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={connectHandler}>
						Let's go
					</Button>
				</Modal.Footer>
			</Modal>
			<canvas onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler} ref={canvasRef} width={600} height={400} />
		</div>
	)
})

export default Canvas
