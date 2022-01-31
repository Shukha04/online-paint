import '../styles/toolbar.scss'
import canvasState from '../store/canvas'
import toolsState from '../store/tools'
import Brush from '../tools/Brush'
import Circle from '../tools/Circle'
import Eraser from '../tools/Eraser'
import Line from '../tools/Line'
import Rect from '../tools/Rect'

const Toolbar = () => {
	const changeColor = e => {
		toolsState.setFillColor(e.target.value)
		toolsState.setStrokeColor(e.target.value)
	}

	const download = () => {
		const dataURL = canvasState.canvas.toDataURL()
		const a = document.createElement('a')
		a.href = dataURL
		a.download = canvasState.sessionID + '.jpg'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	return (
		<div className='toolbar'>
			<button
				className='toolbar__btn brush'
				onClick={() => toolsState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionID))}
			/>
			<button
				className='toolbar__btn rect'
				onClick={() => toolsState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionID))}
			/>
			<button className='toolbar__btn circle' onClick={() => toolsState.setTool(new Circle(canvasState.canvas))} />
			<button className='toolbar__btn eraser' onClick={() => toolsState.setTool(new Eraser(canvasState.canvas))} />
			<button className='toolbar__btn line' onClick={() => toolsState.setTool(new Line(canvasState.canvas))} />
			<input type='color' style={{ marginLeft: 10 }} onChange={changeColor} />
			<button className='toolbar__btn undo' onClick={canvasState.undo} />
			<button className='toolbar__btn redo' onClick={canvasState.redo} />
			<button className='toolbar__btn save' onClick={download} />
		</div>
	)
}

export default Toolbar
