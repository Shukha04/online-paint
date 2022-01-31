import toolsState from '../store/tools'

const Settings = () => {
	return (
		<div className='settings'>
			<label htmlFor='line-width'>Line width</label>
			<input
				type='number'
				id='line-width'
				defaultValue={1}
				min={1}
				max={50}
				style={{ margin: '0 10px' }}
				onChange={e => toolsState.setLineWidth(e.target.value)}
			/>

			<label htmlFor='stroke-color'>Stroke color</label>
			<input
				type='color'
				id='stroke-color'
				style={{ margin: '0 10px' }}
				onChange={e => toolsState.setStrokeColor(e.target.value)}
			/>
		</div>
	)
}

export default Settings
