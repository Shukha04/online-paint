import './styles/app.scss'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Canvas from './components/Canvas'
import Settings from './components/Settings'
import Toolbar from './components/Toolbar'

const App = () => {
	return (
		<BrowserRouter>
			<div className='app'>
				<Switch>
					<Route path='/:id'>
						<Toolbar />
						<Settings />
						<Canvas />
					</Route>
					<Redirect to={(+new Date).toString(16)} />
				</Switch>

			</div>
		</BrowserRouter>
	)
}

export default App

