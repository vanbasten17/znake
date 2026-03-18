import './styles/app.css'
import { createGame } from './game/phaser'
import { setupControlScheme } from './game/systems/controlScheme'
import { getStartHintText, setHintText } from './game/systems/domHud'
import { setupFeedback } from './game/systems/feedback'
import { setupInput } from './game/systems/input'
import { setupLifecycle } from './game/systems/lifecycle'

setupControlScheme()
setupFeedback()
setupInput()
setHintText(getStartHintText())
const game = createGame()
setupLifecycle(game)
