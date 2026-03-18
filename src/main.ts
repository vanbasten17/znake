import './styles/app.css'
import { createGame } from './game/phaser'
import { setupInput } from './game/systems/input'

setupInput()
createGame()
