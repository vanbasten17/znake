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
        moveTouch: 'SWIPE IN ANY DIRECTION TO MOVE',
        itemLegend: 'RED CORE=FOOD · CYAN RING=PORTAL · PURPLE X=RIFT',
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
        guide: 'GUIDE',
        nextObjective: 'NEXT OBJECTIVE: {{objective}}',
        language: 'LANG',
        currency: 'CURRENCY: {{value}}',
        accessibility: 'ACCESSIBILITY',
        a11yHighContrast: 'High contrast',
        a11yLargeText: 'Large text',
        a11yReducedEffects: 'Reduced effects',
        a11yVoice: 'Voice controls',
        on: 'ON',
        off: 'OFF',
        unavailable: 'UNAVAILABLE',
        goalsTitle: 'GOALS (TAP READY TO CLAIM)',
        goalClaimed: 'CLAIMED',
        goalReady: 'CLAIM +{{reward}} C',
        goalProgress: '{{progress}}/{{target}}',
        unlocked: 'UNLOCKED',
        req: 'REQ {{value}}',
        cost: 'COST {{value}}',
        buy: 'BUY {{value}}',
      },
      glossary: {
        title: 'FIELD GUIDE',
        subtitle: 'REFERENCE FOR ITEMS, EFFECTS, HAZARDS, AND ENEMIES',
        close: 'CLOSE',
        category: {
          items: 'ITEMS',
          powerups: 'POWERUPS',
          hazards: 'HAZARDS',
          enemies: 'ENEMIES',
          talents: 'TALENTS',
        },
        entry: {
          red_core: {
            name: 'Red Core',
            description: 'Basic food. Grows snake by 1, gives score, and refreshes core pressure.',
          },
          coolant_charge: {
            name: 'Coolant Charge',
            description: 'Resource shown as COOLANT xN. Absorbs one core-pressure timeout tick.',
          },
          portal: {
            name: 'Portal',
            description: 'Reach it before squeeze closes the arena.',
          },
          rift_battery: {
            name: 'Rift Battery',
            description: 'Temporarily suppresses rift pressure.',
          },
          portal_beacon: {
            name: 'Portal Beacon',
            description: 'Accelerates portal appearance timer.',
          },
          power_shield: {
            name: 'Shield Charge',
            description: 'Absorbs one lethal collision hit.',
          },
          power_slow: {
            name: 'Time Slow',
            description: 'Enemies move slower for a while.',
          },
          power_ghost: {
            name: 'Ghost Charge',
            description: 'Allows one wall pass.',
          },
          power_score: {
            name: 'Score Burst',
            description: 'Instant bonus score.',
          },
          hazard_darkness: {
            name: 'Darkness',
            description: 'Limits visibility around the snake head.',
          },
          hazard_squeeze: {
            name: 'Squeeze',
            description: 'Arena borders close in over time.',
          },
          hazard_ice: {
            name: 'Ice Tiles',
            description: 'Adds forced extra movement steps.',
          },
          hazard_sand: {
            name: 'Sand Tiles',
            description: 'Adds movement delay and slows route execution.',
          },
          hazard_rift: {
            name: 'Void Rift',
            description: 'Ambient danger zone active during runs.',
          },
          enemy_normal: {
            name: 'Hunter',
            description: 'Standard enemy snake behavior.',
          },
          enemy_stalker: {
            name: 'Stalker',
            description: 'Faster pursuit-focused elite variant.',
          },
          enemy_ambusher: {
            name: 'Ambusher',
            description: 'Dash-capable elite that punishes alignment.',
          },
          enemy_egg: {
            name: 'Egg',
            description: 'Dormant threat that hatches after a timer.',
          },
          enemy_mirror: {
            name: 'Mirror',
            description: 'Tracks your delayed movement path.',
          },
          enemy_boss: {
            name: 'Boss',
            description: 'Multi-hit apex enemy on boss floors.',
          },
          talent_speed_1: {
            name: 'Speed I',
            description: 'Talent: start 5% faster.',
          },
          talent_speed_2: {
            name: 'Speed II',
            description: 'Talent: start 10% faster.',
          },
          talent_survival_1: {
            name: 'Survival I',
            description: 'Talent: start with +1 shield.',
          },
          talent_survival_2: {
            name: 'Survival II',
            description: 'Talent: start with +2 length.',
          },
          talent_hunt_1: {
            name: 'Hunt I',
            description: 'Talent: stronger score multiplier.',
          },
          talent_hunt_2: {
            name: 'Hunt II',
            description: 'Talent: enemies move slower.',
          },
        },
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
        pressureIn: 'PRESSURE IN {{seconds}}s',
        riftSuppressed: 'RIFT JAMMED {{seconds}}s',
        portalIn: 'PORTAL IN {{seconds}}s',
        portalFind: 'FIND THE PORTAL',
        squeezeIn: 'SQUEEZE IN {{seconds}}s',
        squeezeActive: 'SQUEEZE ACTIVE',
        portalAccelerated: 'PORTAL DESTABILIZED',
        portalChoose: 'CHOOSE A PORTAL',
        portalChooseHint: 'PORTAL READY · CYAN = SAFER · AMBER = RISKIER',
        routeSafer: 'ROUTE: SAFER',
        routeRiskier: 'ROUTE: RISKIER',
        corePressure: 'CORE PRESSURE {{seconds}}s',
        corePressureWithCoolant: 'CORE PRESSURE {{seconds}}s · COOLANT x{{charges}}',
        objectivePortalPreview: 'SURVIVE UNTIL PORTAL',
        objectiveScorePreview: 'REACH {{target}} SCORE',
        objectiveKillsPreview: 'DEFEAT {{target}} ENEMIES',
        objectiveBossPreview: 'DEFEAT BOSS',
        objectiveScoreStatus: 'SCORE {{progress}}/{{target}} · {{pressure}}',
        objectiveKillsStatus: 'KILLS {{progress}}/{{target}} · {{pressure}}',
        modifierDarkness: 'DARKNESS',
        modifierIce: 'ICE',
        modifierSand: 'SAND',
        bossKnockback: 'BOSS IMPACT - KNOCKBACK',
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
        moveTouch: 'FES SWIPE EN QUALSEVOL DIRECCIÓ PER MOURE',
        itemLegend: 'NUCLI VERMELL=MENJAR · ANELL CIAN=PORTAL · X LILA=ESCLETXA',
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
        guide: 'GUIA',
        nextObjective: 'OBJECTIU SEGÜENT: {{objective}}',
        language: 'IDIOMA',
        currency: 'MONEDA: {{value}}',
        accessibility: 'ACCESSIBILITAT',
        a11yHighContrast: 'Alt contrast',
        a11yLargeText: 'Text gran',
        a11yReducedEffects: 'Efectes reduïts',
        a11yVoice: 'Control per veu',
        on: 'ACTIU',
        off: 'INACTIU',
        unavailable: 'NO DISPONIBLE',
        goalsTitle: 'OBJECTIUS (TOCA SI ESTÀ LLEST PER COBRAR)',
        goalClaimed: 'COBRAT',
        goalReady: 'COBRAR +{{reward}} C',
        goalProgress: '{{progress}}/{{target}}',
        unlocked: 'DESBLOQUEJAT',
        req: 'REQ {{value}}',
        cost: 'COST {{value}}',
        buy: 'COMPRAR {{value}}',
      },
      glossary: {
        title: 'GUIA DE CAMP',
        subtitle: "REFERÈNCIA D'OBJECTES, EFECTES, HAZARDS I ENEMICS",
        close: 'TANCAR',
        category: {
          items: 'OBJECTES',
          powerups: 'POWERUPS',
          hazards: 'HAZARDS',
          enemies: 'ENEMICS',
          talents: 'TALENTS',
        },
        entry: {
          red_core: {
            name: 'Nucli vermell',
            description:
              'Menjar base. Fa créixer la serp +1, dona punts i refresca la pressió del nucli.',
          },
          coolant_charge: {
            name: 'Càrrega de refrigerant',
            description:
              'Recurs que es mostra com COOLANT xN. Absorbeix un tick de timeout de pressió.',
          },
          portal: {
            name: 'Portal',
            description: "Arriba-hi abans que el tancament redueixi l'àrea.",
          },
          rift_battery: {
            name: "Bateria d'escletxa",
            description: "Suprimeix temporalment la pressió de l'escletxa.",
          },
          portal_beacon: {
            name: 'Balisa de portal',
            description: "Accelera l'aparició del portal.",
          },
          power_shield: {
            name: "Càrrega d'escut",
            description: 'Absorbeix un impacte letal.',
          },
          power_slow: {
            name: 'Camp lent',
            description: 'Els enemics es mouen més lents durant uns segons.',
          },
          power_ghost: {
            name: 'Càrrega fantasma',
            description: 'Permet travessar una paret una vegada.',
          },
          power_score: {
            name: 'Explosió de punts',
            description: 'Bonus instantani de puntuació.',
          },
          hazard_darkness: {
            name: 'Foscor',
            description: 'Limita la visibilitat al voltant del cap de la serp.',
          },
          hazard_squeeze: {
            name: 'Tancament',
            description: "Les vores de l'arena es tanquen amb el temps.",
          },
          hazard_ice: {
            name: 'Rajoles de gel',
            description: 'Forcen passos extra de moviment.',
          },
          hazard_sand: {
            name: 'Rajoles de sorra',
            description: "Afegeixen retard de moviment i frenen l'execució.",
          },
          hazard_rift: {
            name: 'Escletxa del buit',
            description: 'Zona de perill ambiental activa durant la run.',
          },
          enemy_normal: {
            name: 'Caçador',
            description: "Comportament estàndard d'enemic serp.",
          },
          enemy_stalker: {
            name: 'Stalker',
            description: "Variant d'elit més ràpida i orientada a persecució.",
          },
          enemy_ambusher: {
            name: 'Ambusher',
            description: "Elit amb dash que castiga l'alineació.",
          },
          enemy_egg: {
            name: 'Ou',
            description: 'Amenaça latent que eclosiona després de comptador.',
          },
          enemy_mirror: {
            name: 'Mirall',
            description: 'Segueix la teva ruta amb retard.',
          },
          enemy_boss: {
            name: 'Boss',
            description: 'Enemic àpex de múltiples impactes als pisos de boss.',
          },
          talent_speed_1: {
            name: 'Velocitat I',
            description: 'Talent: comença un 5% més ràpid.',
          },
          talent_speed_2: {
            name: 'Velocitat II',
            description: 'Talent: comença un 10% més ràpid.',
          },
          talent_survival_1: {
            name: 'Supervivència I',
            description: 'Talent: comença amb +1 escut.',
          },
          talent_survival_2: {
            name: 'Supervivència II',
            description: 'Talent: comença amb +2 de longitud.',
          },
          talent_hunt_1: {
            name: 'Caça I',
            description: 'Talent: millora el multiplicador de puntuació.',
          },
          talent_hunt_2: {
            name: 'Caça II',
            description: 'Talent: enemics més lents.',
          },
        },
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
        pressureIn: 'PRESSIÓ EN {{seconds}}s',
        riftSuppressed: 'ESCLETXA BLOQUEJADA {{seconds}}s',
        portalIn: 'PORTAL EN {{seconds}}s',
        portalFind: 'TROBA EL PORTAL',
        squeezeIn: 'TANCAMENT EN {{seconds}}s',
        squeezeActive: 'TANCAMENT ACTIU',
        portalAccelerated: 'PORTAL INESTABLE',
        portalChoose: 'TRIA UN PORTAL',
        portalChooseHint: 'PORTAL A PUNT · CIAN = MÉS SEGUR · AMBRE = MÉS ARRISCAT',
        routeSafer: 'RUTA: SEGURA',
        routeRiskier: 'RUTA: ARRISCADA',
        corePressure: 'PRESSIÓ DEL NUCLI {{seconds}}s',
        corePressureWithCoolant: 'PRESSIÓ DEL NUCLI {{seconds}}s · REFRIGERANT x{{charges}}',
        objectivePortalPreview: 'SOBREVIU FINS AL PORTAL',
        objectiveScorePreview: 'ARRIBA A {{target}} PUNTS',
        objectiveKillsPreview: 'DERROTA {{target}} ENEMICS',
        objectiveBossPreview: 'DERROTA EL BOSS',
        objectiveScoreStatus: 'PUNTS {{progress}}/{{target}} · {{pressure}}',
        objectiveKillsStatus: 'KILLS {{progress}}/{{target}} · {{pressure}}',
        modifierDarkness: 'FOSCOR',
        modifierIce: 'GEL',
        modifierSand: 'SORRA',
        bossKnockback: 'IMPACTE DE BOSS - RETROCÉS',
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
