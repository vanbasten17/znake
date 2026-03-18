import './styles/app.css'
import { setupControlScheme } from './game/systems/controlScheme'
import { getStartHintText, setHintText } from './game/systems/domHud'
import { setupFeedback } from './game/systems/feedback'
import { setupInput } from './game/systems/input'

setupControlScheme()
setupFeedback()
setupInput()
setHintText(getStartHintText())

const boot = async (): Promise<void> => {
  setHintText('LOADING ZNAKE ENGINE...')
  try {
    const [{ createGame }, { setupLifecycle }] = await Promise.all([
      import('./game/phaser'),
      import('./game/systems/lifecycle'),
    ])
    const game = createGame()
    setupLifecycle(game)
    setHintText(getStartHintText())
  } catch {
    setHintText('LOAD FAILED - REFRESH TO RETRY')
  }
}

void boot()
