import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      app: {
        title: 'Znake',
      },
      hud: {
        run: 'RUN',
        score: 'SCORE',
        floor: 'FLOOR',
        kills: 'KILLS',
      },
      controls: {
        pause: 'PAUSE',
        start: 'START',
        moveUp: 'Move up',
        moveDown: 'Move down',
        moveLeft: 'Move left',
        moveRight: 'Move right',
        pauseGame: 'Pause game',
        startGame: 'Start game',
      },
      hint: {
        loading: 'LOADING ZNAKE ENGINE...',
        loadFailed: 'LOAD FAILED - REFRESH TO RETRY',
        autoPaused: 'AUTO-PAUSED (APP BACKGROUND) - TAP PAUSE/START TO CONTINUE',
        moveKeyboard: 'ARROW KEYS OR WASD TO MOVE - SPACE TO PAUSE',
        moveTouch: 'SWIPE OR D-PAD TO MOVE - PAUSE II',
        startKeyboard: 'PRESS ENTER OR SPACE TO START',
        startTouch: 'TAP START TO PLAY',
        restartKeyboard: 'ENTER/SPACE: NEXT RUN - M: MAIN MENU',
        restartTouch: 'TAP NEXT RUN OR MAIN MENU',
        upgradeKeyboard: 'PRESS 1, 2 OR 3 TO PICK AN UPGRADE',
        upgradeTouch: 'TAP AN UPGRADE CARD TO CONTINUE',
      },
      menu: {
        subtitle: '- ROGUELITE -',
        bestScore: 'BEST SCORE: {{best}}',
        talentShop: 'TALENT SHOP',
        startPrompt: 'PRESS START > RELIC DRAFT',
        language: 'LANG',
        currency: 'CURRENCY: {{value}}',
        goalsTitle: 'GOALS (TAP READY TO CLAIM)',
        goalClaimed: 'CLAIMED',
        goalReady: 'CLAIM +{{reward}} C',
        goalProgress: '{{progress}}/{{target}}',
        unlocked: 'UNLOCKED',
        req: 'REQ {{value}}',
        cost: 'COST {{value}}',
        buy: 'BUY {{value}}',
      },
      goal: {
        floor_5_name: 'Reach Floor 5',
        elite_hunter_12_name: 'Defeat 12 Elite Enemies',
      },
      talent: {
        speed_1_name: 'Speed I',
        speed_1_description: 'Start 5% faster.',
        speed_2_name: 'Speed II',
        speed_2_description: 'Start 10% faster.',
        survival_1_name: 'Survival I',
        survival_1_description: 'Start with +1 shield.',
        survival_2_name: 'Survival II',
        survival_2_description: 'Start with +2 length.',
        hunt_1_name: 'Hunt I',
        hunt_1_description: 'Higher score multiplier.',
        hunt_2_name: 'Hunt II',
        hunt_2_description: 'Enemies move slower.',
      },
      biome: {
        void_depths: 'VOID DEPTHS',
      },
      relic: {
        selectTitle: 'SELECT A RELIC',
        plasma_core_name: 'Plasma Core',
        plasma_core_description: 'Start longer and faster.',
        void_shadow_name: 'Void Shadow',
        void_shadow_description: 'Start with ghost pass + shield.',
        symbiont_name: 'Symbiont',
        symbiont_description: 'Stronger hunt scoring.',
      },
      upgrade: {
        floorCleared: 'FLOOR CLEARED',
        chooseOne: 'CHOOSE ONE UPGRADE',
        scoreFloor: 'SCORE: {{score}}  -  FLOOR: {{floor}}',
        speed_boost_name: 'OVERCLOCK',
        speed_boost_desc: '+15% speed',
        start_length_name: 'BIOMASS',
        start_length_desc: 'Start 3 cells longer',
        shield_name: 'VOID SHIELD',
        shield_desc: 'Begin with +1 shield',
        magnet_name: 'ATTRACTOR',
        magnet_desc: 'Food drifts toward you',
        ghost_name: 'PHASE SHIFT',
        ghost_desc: 'Pass through wall once',
        score_mult_name: 'ECHO HARVEST',
        score_mult_desc: '2x score',
        slow_field_name: 'TIME RIFT',
        slow_field_desc: 'Enemies move slower',
        regen_name: 'CELL REGEN',
        regen_desc: 'Tail degrades over time',
      },
      death: {
        title: 'THE VOID CLAIMED YOU',
        score: 'SCORE: {{score}}',
        finalFloor: 'FINAL FLOOR: {{floor}}',
        enemiesDefeated: 'ENEMIES DEFEATED: {{kills}}',
        best: 'BEST: {{best}}',
        runReward: 'RUN REWARD: +{{reward}} C',
        totalCurrency: 'TOTAL CURRENCY: {{currency}}',
        newRecord: 'NEW RECORD',
        upgradesEarned: 'UPGRADES EARNED:',
        nextRun: 'NEXT RUN',
        mainMenu: 'MAIN MENU',
      },
      game: {
        floorProgress: '{{biome}} - FLOOR {{floor}}{{bossTag}} - {{progress}}/{{goal}}',
        floorProgressBoss: '{{biome}} - FLOOR {{floor}}{{bossTag}}',
        bossTag: ' - BOSS',
        toNextFloor: '{{remaining}} FOR NEXT FLOOR',
        bossAdvance: 'DEFEAT BOSS TO ADVANCE',
        riftSuppressed: 'RIFT JAMMED {{seconds}}s',
      },
    },
  },
  ca: {
    translation: {
      app: {
        title: 'Znake',
      },
      hud: {
        run: 'RUN',
        score: 'PUNTS',
        floor: 'PIS',
        kills: 'KILLS',
      },
      controls: {
        pause: 'PAUSA',
        start: 'INICI',
        moveUp: 'Moure amunt',
        moveDown: 'Moure avall',
        moveLeft: 'Moure esquerra',
        moveRight: 'Moure dreta',
        pauseGame: 'Pausar joc',
        startGame: 'Iniciar joc',
      },
      hint: {
        loading: 'CARREGANT MOTOR DE ZNAKE...',
        loadFailed: 'ERROR DE CÀRREGA - REFRESCA PER REINTENTAR',
        autoPaused: 'AUTO-PAUSA (APP EN SEGON PLA) - TOCA PAUSA/INICI PER CONTINUAR',
        moveKeyboard: 'FLETXES O WASD PER MOURE - ESPAI PER PAUSAR',
        moveTouch: 'SWIPE O D-PAD PER MOURE - PAUSA II',
        startKeyboard: 'PREM ENTER O ESPAI PER INICIAR',
        startTouch: 'TOCA INICI PER JUGAR',
        restartKeyboard: 'ENTER/ESPAI: NOVA RUN - M: MENÚ',
        restartTouch: 'TOCA NEXT RUN O MENÚ PRINCIPAL',
        upgradeKeyboard: 'PREM 1, 2 O 3 PER TRIAR UNA MILLORA',
        upgradeTouch: 'TOCA UNA TARGETA DE MILLORA PER CONTINUAR',
      },
      menu: {
        subtitle: '- ROGUELITE -',
        bestScore: 'MILLOR PUNTUACIÓ: {{best}}',
        talentShop: 'BOTIGA DE TALENTS',
        startPrompt: 'PREM START > DRAFT DE RELÍQUIA',
        language: 'IDIOMA',
        currency: 'MONEDA: {{value}}',
        goalsTitle: 'OBJECTIUS (TOCA SI ESTÀ LLEST PER COBRAR)',
        goalClaimed: 'COBRAT',
        goalReady: 'COBRAR +{{reward}} C',
        goalProgress: '{{progress}}/{{target}}',
        unlocked: 'DESBLOQUEJAT',
        req: 'REQ {{value}}',
        cost: 'COST {{value}}',
        buy: 'COMPRAR {{value}}',
      },
      goal: {
        floor_5_name: 'Arriba al pis 5',
        elite_hunter_12_name: 'Derrota 12 enemics d’elit',
      },
      talent: {
        speed_1_name: 'Velocitat I',
        speed_1_description: 'Comença un 5% més ràpid.',
        speed_2_name: 'Velocitat II',
        speed_2_description: 'Comença un 10% més ràpid.',
        survival_1_name: 'Supervivència I',
        survival_1_description: 'Comença amb +1 escut.',
        survival_2_name: 'Supervivència II',
        survival_2_description: 'Comença amb +2 de longitud.',
        hunt_1_name: 'Caça I',
        hunt_1_description: 'Millora el multiplicador de puntuació.',
        hunt_2_name: 'Caça II',
        hunt_2_description: 'Els enemics es mouen més lents.',
      },
      biome: {
        void_depths: 'PROFUNDITATS DEL BUIT',
      },
      relic: {
        selectTitle: 'SELECCIONA UNA RELÍQUIA',
        plasma_core_name: 'Nucli de Plasma',
        plasma_core_description: 'Comença més llarg i més ràpid.',
        void_shadow_name: 'Ombra del Buit',
        void_shadow_description: 'Comença amb pas fantasma + escut.',
        symbiont_name: 'Simbiont',
        symbiont_description: 'Millora la puntuació de caça.',
      },
      upgrade: {
        floorCleared: 'PIS SUPERAT',
        chooseOne: 'TRIA UNA MILLORA',
        scoreFloor: 'PUNTS: {{score}}  -  PIS: {{floor}}',
        speed_boost_name: 'OVERCLOCK',
        speed_boost_desc: '+15% velocitat',
        start_length_name: 'BIOMASSA',
        start_length_desc: 'Comença amb 3 cel·les extra',
        shield_name: 'ESCUT DEL BUIT',
        shield_desc: 'Comença amb +1 escut',
        magnet_name: 'ATRACTOR',
        magnet_desc: "El menjar s'acosta cap a tu",
        ghost_name: 'PHASE SHIFT',
        ghost_desc: 'Travessa una paret una vegada',
        score_mult_name: 'COL·LECTA PRO',
        score_mult_desc: 'Puntuació x2',
        slow_field_name: 'ESCLETXA TEMPORAL',
        slow_field_desc: 'Els enemics es mouen més lents',
        regen_name: 'REGENERACIÓ CEL·LULAR',
        regen_desc: 'La cua es degrada amb el temps',
      },
      death: {
        title: "EL BUIT T'HA RECLAMAT",
        score: 'PUNTS: {{score}}',
        finalFloor: 'PIS FINAL: {{floor}}',
        enemiesDefeated: 'ENEMICS ELIMINATS: {{kills}}',
        best: 'MILLOR: {{best}}',
        runReward: 'RECOMPENSA RUN: +{{reward}} C',
        totalCurrency: 'MONEDA TOTAL: {{currency}}',
        newRecord: 'NOU RÈCORD',
        upgradesEarned: 'MILLORES ACONSEGUIDES:',
        nextRun: 'SEGÜENT RUN',
        mainMenu: 'MENÚ PRINCIPAL',
      },
      game: {
        floorProgress: '{{biome}} - PIS {{floor}}{{bossTag}} - {{progress}}/{{goal}}',
        floorProgressBoss: '{{biome}} - PIS {{floor}}{{bossTag}}',
        bossTag: ' - BOSS',
        toNextFloor: '{{remaining}} PER SEGÜENT PIS',
        bossAdvance: 'DERROTA EL BOSS PER AVANÇAR',
        riftSuppressed: 'ESCLETXA BLOQUEJADA {{seconds}}s',
      },
    },
  },
} as const

const applyStaticDomTranslations = (): void => {
  const map: Array<{ id: string; key: string }> = [
    { id: 'run-label', key: 'hud.run' },
    { id: 'score-label', key: 'hud.score' },
    { id: 'floor-label', key: 'hud.floor' },
    { id: 'kills-label', key: 'hud.kills' },
    { id: 'pause-text', key: 'controls.pause' },
    { id: 'start-text', key: 'controls.start' },
  ]
  for (const { id, key } of map) {
    const node = document.getElementById(id)
    if (node) {
      node.textContent = i18next.t(key)
    }
  }

  document.title = i18next.t('app.title')
  document.documentElement.lang = i18next.resolvedLanguage ?? 'en'
  document.getElementById('btn-up')?.setAttribute('aria-label', i18next.t('controls.moveUp'))
  document.getElementById('btn-down')?.setAttribute('aria-label', i18next.t('controls.moveDown'))
  document.getElementById('btn-left')?.setAttribute('aria-label', i18next.t('controls.moveLeft'))
  document.getElementById('btn-right')?.setAttribute('aria-label', i18next.t('controls.moveRight'))
  document.getElementById('btn-pause')?.setAttribute('aria-label', i18next.t('controls.pauseGame'))
  document.getElementById('btn-start')?.setAttribute('aria-label', i18next.t('controls.startGame'))
}

export const initI18n = async (): Promise<void> => {
  if (!i18next.isInitialized) {
    await i18next.use(LanguageDetector).init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ca'],
      interpolation: { escapeValue: false },
      detection: {
        order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'znake_lang',
      },
    })
  }
  applyStaticDomTranslations()
  i18next.off('languageChanged', applyStaticDomTranslations)
  i18next.on('languageChanged', applyStaticDomTranslations)
}

export const t = (key: string, vars?: Record<string, unknown>): string => i18next.t(key, vars)

export const getLanguage = (): 'en' | 'ca' => (i18next.resolvedLanguage === 'ca' ? 'ca' : 'en')

export const setLanguage = async (lang: 'en' | 'ca'): Promise<void> => {
  await i18next.changeLanguage(lang)
}

export const toggleLanguage = async (): Promise<'en' | 'ca'> => {
  const next = getLanguage() === 'ca' ? 'en' : 'ca'
  await setLanguage(next)
  return next
}
