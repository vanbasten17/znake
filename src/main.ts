import './styles/tokens.css'
import './styles/shell.css'
import './styles/app.css'
import { setupAccessibility } from './game/systems/accessibility'
import { setupControlScheme } from './game/systems/controlScheme'
import { getStartHintText, setHintText } from './game/systems/domHud'
import { setupFeedback } from './game/systems/feedback'
import { initI18n, t } from './game/systems/i18n'
import { setupInput } from './game/systems/input'
import { setupVoiceInput } from './game/systems/voiceInput'
import { mountShell } from './ui/mountShell'

mountShell()
setupControlScheme()
setupAccessibility()
setupFeedback()
setupInput()
setupVoiceInput()

const boot = async (): Promise<void> => {
  await initI18n()
  setHintText(t('hint.loading'))
  try {
    const [{ createGame }, { setupLifecycle }] = await Promise.all([
      import('./game/phaser'),
      import('./game/systems/lifecycle'),
    ])
    const game = createGame()
    setupLifecycle(game)
    setHintText(getStartHintText())
  } catch {
    setHintText(t('hint.loadFailed'))
  }
}

void boot()
