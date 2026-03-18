import './styles/app.css'
import { createGame } from './game/phaser'
import { setupControlScheme } from './game/systems/controlScheme'
import { getStartHintText, setHintText } from './game/systems/domHud'
import { setupInput } from './game/systems/input'

setupControlScheme()
setupInput()
setHintText(getStartHintText())
createGame()
