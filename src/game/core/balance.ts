import type {
  BiomeId,
  BiomeRuleDefinition,
  ChallengeMutatorDefinition,
  EnemyRole,
  EventChoiceDefinition,
  FloorTemplate,
  NonBossObjectiveKind,
  RewardOption,
  RoomObjectiveKind,
  RunConfig,
  RunMapRoomType,
  TalentId,
} from './types'

export const BALANCE = {
  run: {
    moveIntervalMs: 160,
    baseSnakeLength: 4,
    bonusStartLength: 0,
    bonusShields: 0,
    hasMagnet: false,
    magnetRadius: 4,
    ghostCharges: 0,
    scoreMult: 1,
    powerupScoreMult: 1,
    powerupGrowth: 0,
    enemySlow: 1,
    hasRegen: false,
    regenIntervalMs: 5000,
  },
  floor: {
    wallBase: 2,
    wallPerFloor: 1,
    wallCap: 7,
    enemyBase: 1,
    enemyPerFloorStep: 2,
    enemyCap: 4,
    foodGoalBase: 7,
    foodGoalPerFloor: 2,
    lengthGoalBase: 8,
    lengthGoalPerFloor: 1,
    enemyIntervalBaseMs: 550,
    enemyIntervalPerFloorMs: 30,
    enemyIntervalMinMs: 350,
  },
  floorTemplate: {
    roomsV1: {
      enabled: true,
      startFloor: 4,
      cadence: 2,
      maxGenerateAttempts: 8,
      minRooms: 3,
      maxRooms: 5,
      minRoomSize: 3,
      maxRoomSize: 6,
      minRoomGap: 1,
    },
  },
  portal: {
    countdownBaseMs: 10000,
    countdownPerFloorMs: 0,
    countdownMinMs: 10000,
    graceMs: 7000,
    squeezeStepMs: 3600,
    squeezeMaxInset: 8,
    routeChoice: {
      safer: {
        enemyDelta: -1,
        wallDelta: -1,
        enemyIntervalMultiplier: 1.12,
      },
      riskier: {
        enemyDelta: 1,
        wallDelta: 1,
        enemyIntervalMultiplier: 0.9,
        scoreBonus: 18,
      },
    },
  },
  modifiers: {
    darkness: {
      enabled: true,
      startFloor: 1,
      minVisibilityRadius: 6,
      maxVisibilityRadius: 4,
      minEdgeFalloff: 2,
      maxEdgeFalloff: 1,
      minAlphaOuter: 0.26,
      maxAlphaOuter: 0.76,
      minAlphaEdge: 0.16,
      maxAlphaEdge: 0.44,
    },
    ice: {
      enabled: true,
      startFloor: 2,
      cadence: 2,
      minTileCount: 3,
      maxTileCount: 7,
      slideSteps: 1,
    },
    sand: {
      enabled: true,
      startFloor: 3,
      cadence: 2,
      minTileCount: 3,
      maxTileCount: 6,
      movePenaltyMs: 45,
    },
  },
  objectives: {
    rotation: ['portal', 'score', 'kills'] satisfies ReadonlyArray<NonBossObjectiveKind>,
    scoreTargetBase: 36,
    scoreTargetPerFloor: 8,
    scoreTargetCap: 180,
    killTargetBase: 1,
    killTargetPerFloorStep: 2,
    killTargetCap: 4,
  },
  roomObjectives: {
    rotation: [
      'survive',
      'collect_cores',
      'defeat_elite',
      'activate_terminals',
    ] satisfies ReadonlyArray<RoomObjectiveKind>,
    surviveDurationBaseMs: 18000,
    surviveDurationPerFloorMs: 1000,
    surviveDurationCapMs: 26000,
    collectCoresBase: 2,
    collectCoresPerFloorStep: 2,
    collectCoresCap: 4,
    defeatEliteBase: 1,
    defeatEliteCap: 2,
    activateTerminalsBase: 2,
    activateTerminalsCap: 3,
  },
  cleanPlay: {
    rules: {
      invalidateOnShieldHit: true,
      invalidateOnBodyHit: true,
    },
    payout: {
      type: 'score',
      scoreByObjectiveKind: {
        survive: 20,
        collect_cores: 24,
        defeat_elite: 30,
        activate_terminals: 26,
      } satisfies Record<RoomObjectiveKind, number>,
      maxAwardsPerRunByObjectiveKind: {
        survive: 3,
        collect_cores: 3,
        defeat_elite: 2,
        activate_terminals: 3,
      } satisfies Record<RoomObjectiveKind, number>,
    },
  },
  runMap: {
    previewHorizon: 2,
    branchChoicesOnPortalObjective: 2,
    branchChoicesOtherwise: 1,
    biomeWeightsByDepth: [
      {
        minDepth: 0,
        weights: {
          'void-depths': 1,
          'crystal-caverns': 0,
          'ember-fields': 0,
        } satisfies Record<BiomeId, number>,
      },
      {
        minDepth: 2,
        weights: {
          'void-depths': 0.55,
          'crystal-caverns': 0.25,
          'ember-fields': 0.2,
        } satisfies Record<BiomeId, number>,
      },
      {
        minDepth: 5,
        weights: {
          'void-depths': 0.3,
          'crystal-caverns': 0.35,
          'ember-fields': 0.35,
        } satisfies Record<BiomeId, number>,
      },
    ] as const,
    elite: {
      enemyCountDelta: 1,
      enemyIntervalMultiplier: 0.9,
    },
    nonCombat: {
      shopScoreBonus: 40,
      restBonusShields: 1,
      eventBonusLength: 1,
    },
    roomTypeWeightsByDepth: [
      {
        minDepth: 0,
        weights: {
          combat: 1,
          elite: 0,
          shop: 0,
          rest: 0,
          event: 0,
        } satisfies Record<RunMapRoomType, number>,
      },
      {
        minDepth: 1,
        weights: {
          combat: 0.72,
          elite: 0.18,
          shop: 0.04,
          rest: 0.03,
          event: 0.03,
        } satisfies Record<RunMapRoomType, number>,
      },
      {
        minDepth: 4,
        weights: {
          combat: 0.56,
          elite: 0.2,
          shop: 0.08,
          rest: 0.08,
          event: 0.08,
        } satisfies Record<RunMapRoomType, number>,
      },
    ] as const,
  },
  eventChoices: {
    minOptionsPerDraft: 2,
    maxOptionsPerDraft: 3,
    minRecoverableSnakeLength: 2,
    minEnemyIntervalMs: 180,
    minMoveIntervalMs: 90,
    definitions: [
      {
        id: 'risky_trade_molt',
        kind: 'risky_trade',
        minFloor: 1,
        weight: 1,
        options: [
          {
            id: 'trade_length_for_shield',
            family: 'survival',
            labelKey: 'game.eventChoice.tradeLengthForShield.label',
            upsideKey: 'game.eventChoice.tradeLengthForShield.upside',
            downsideKey: 'game.eventChoice.tradeLengthForShield.downside',
            summaryKey: 'game.eventChoice.tradeLengthForShield.summary',
            requiresConfirm: false,
            effects: {
              shieldDelta: 1,
              lengthDelta: -2,
            },
          },
          {
            id: 'trade_shield_for_length',
            family: 'control',
            labelKey: 'game.eventChoice.tradeShieldForLength.label',
            upsideKey: 'game.eventChoice.tradeShieldForLength.upside',
            downsideKey: 'game.eventChoice.tradeShieldForLength.downside',
            summaryKey: 'game.eventChoice.tradeShieldForLength.summary',
            requiresConfirm: false,
            effects: {
              shieldDelta: -1,
              lengthDelta: 2,
            },
          },
          {
            id: 'trade_score_for_shield',
            family: 'utility',
            labelKey: 'game.eventChoice.tradeScoreForShield.label',
            upsideKey: 'game.eventChoice.tradeScoreForShield.upside',
            downsideKey: 'game.eventChoice.tradeScoreForShield.downside',
            summaryKey: 'game.eventChoice.tradeScoreForShield.summary',
            requiresConfirm: false,
            effects: {
              shieldDelta: 1,
              scoreDelta: -20,
            },
          },
        ],
      },
      {
        id: 'curse_offer_pressure',
        kind: 'curse_offer',
        minFloor: 2,
        weight: 1,
        options: [
          {
            id: 'curse_haste_barrier',
            family: 'survival',
            labelKey: 'game.eventChoice.curseHasteBarrier.label',
            upsideKey: 'game.eventChoice.curseHasteBarrier.upside',
            downsideKey: 'game.eventChoice.curseHasteBarrier.downside',
            summaryKey: 'game.eventChoice.curseHasteBarrier.summary',
            requiresConfirm: true,
            effects: {
              shieldDelta: 1,
              enemyIntervalMultiplier: 0.88,
            },
          },
          {
            id: 'curse_bulk_drag',
            family: 'control',
            labelKey: 'game.eventChoice.curseBulkDrag.label',
            upsideKey: 'game.eventChoice.curseBulkDrag.upside',
            downsideKey: 'game.eventChoice.curseBulkDrag.downside',
            summaryKey: 'game.eventChoice.curseBulkDrag.summary',
            requiresConfirm: true,
            effects: {
              lengthDelta: 2,
              moveIntervalMultiplier: 1.08,
            },
          },
        ],
      },
      {
        id: 'route_split_event',
        kind: 'safe_vs_dangerous_route',
        minFloor: 1,
        weight: 1,
        options: [
          {
            id: 'route_safe_guarded',
            family: 'survival',
            labelKey: 'game.eventChoice.routeSafeGuarded.label',
            upsideKey: 'game.eventChoice.routeSafeGuarded.upside',
            downsideKey: 'game.eventChoice.routeSafeGuarded.downside',
            summaryKey: 'game.eventChoice.routeSafeGuarded.summary',
            requiresConfirm: false,
            effects: {
              routeIntent: 'safer',
              enemyIntervalMultiplier: 1.12,
              moveIntervalMultiplier: 1.03,
            },
          },
          {
            id: 'route_risk_hunt',
            family: 'aggro',
            labelKey: 'game.eventChoice.routeRiskHunt.label',
            upsideKey: 'game.eventChoice.routeRiskHunt.upside',
            downsideKey: 'game.eventChoice.routeRiskHunt.downside',
            summaryKey: 'game.eventChoice.routeRiskHunt.summary',
            requiresConfirm: true,
            effects: {
              routeIntent: 'riskier',
              scoreDelta: 24,
              enemyIntervalMultiplier: 0.9,
            },
          },
        ],
      },
    ] satisfies ReadonlyArray<EventChoiceDefinition>,
  },
  challengeMutators: {
    enabled: true,
    maxActive: 2,
    maxShownInHud: 2,
    guardrails: {
      pressureBudgetMax: 2,
      minMoveIntervalMs: 90,
      minEnemyIntervalMs: 180,
      maxBodySpendMinLength: 3,
      maxEventMinSnakeLength: 3,
      blockedPairs: [['tempo_spike', 'tight_turns']] as const,
    },
    availability: {
      requiredGoal: 'floor_5' as const,
      requiredProgress: 5,
    },
    catalog: [
      {
        id: 'tempo_spike',
        label: 'TEMPO SPIKE',
        summary: 'Faster enemies and shorter survive objectives.',
        domain: 'pressure',
        minFloor: 2,
        weight: 1,
        pressureCost: 1,
        effects: {
          enemyIntervalMultiplier: 0.92,
          surviveObjectiveTargetMultiplier: 0.92,
        },
      },
      {
        id: 'tight_turns',
        label: 'TIGHT TURNS',
        summary: 'Turn queue is shorter and routing is stricter.',
        domain: 'constraint',
        minFloor: 2,
        weight: 1,
        pressureCost: 1,
        effects: {
          maxTurnQueueDelta: -1,
        },
      },
      {
        id: 'lean_market',
        label: 'LEAN MARKET',
        summary: 'Body spending demands a higher safety floor.',
        domain: 'economy',
        minFloor: 3,
        weight: 1,
        pressureCost: 0,
        effects: {
          bodySpendMinLengthDelta: 1,
          eventMinSnakeLengthDelta: 1,
        },
      },
      {
        id: 'route_tension',
        label: 'ROUTE TENSION',
        summary: 'Riskier routes gain extra pressure, safer routes relax more.',
        domain: 'routing',
        minFloor: 3,
        weight: 1,
        pressureCost: 0,
        effects: {
          saferRouteEnemyDelta: -1,
          riskierRouteEnemyDelta: 1,
        },
      },
    ] satisfies ReadonlyArray<ChallengeMutatorDefinition>,
  },
  biomeRules: {
    maxActive: 1,
    guardrails: {
      pressureBudgetMax: 1,
      fallbackPriority: ['downgrade', 'replace', 'defer'] as const,
    },
    readability: {
      maxShownInHud: 1,
    },
    catalog: [
      {
        id: 'void_flux',
        biomeId: 'void-depths',
        domain: 'survival_rhythm',
        label: 'VOID FLUX',
        summary: 'Pressure ticks accelerate, route choices carry sharper timing risk.',
        tacticalTag: 'tempo',
        pressureCost: 1,
        effects: {
          enemyIntervalMultiplier: 0.94,
          saferRouteEnemyDelta: 0,
          riskierRouteEnemyDelta: 1,
        },
        blockedObjectiveKinds: ['activate_terminals'],
        blockedMutatorDomains: ['pressure'],
        maxBodySpendMinLength: 3,
        downgradeToRuleId: 'void_flux_soft',
      },
      {
        id: 'void_flux_soft',
        biomeId: 'void-depths',
        domain: 'survival_rhythm',
        label: 'VOID FLUX (SOFT)',
        summary: 'A lighter tempo variant keeps pressure readable.',
        tacticalTag: 'tempo',
        pressureCost: 0,
        effects: {
          enemyIntervalMultiplier: 0.97,
          riskierRouteEnemyDelta: 0,
        },
      },
      {
        id: 'crystal_slip',
        biomeId: 'crystal-caverns',
        domain: 'movement_constraint',
        label: 'CRYSTAL SLIP',
        summary: 'Safer lanes tighten while risky branches demand cleaner turns.',
        tacticalTag: 'lanes',
        pressureCost: 1,
        effects: {
          saferRouteEnemyDelta: 1,
          riskierRouteEnemyDelta: 0,
          bodySpendMinLengthDelta: 1,
        },
        blockedMutatorDomains: ['constraint', 'economy'],
        maxBodySpendMinLength: 2,
        downgradeToRuleId: 'crystal_slip_soft',
      },
      {
        id: 'crystal_slip_soft',
        biomeId: 'crystal-caverns',
        domain: 'movement_constraint',
        label: 'CRYSTAL SLIP (SOFT)',
        summary: 'A lighter lane-pressure variant preserves recoverability.',
        tacticalTag: 'lanes',
        pressureCost: 0,
        effects: {
          saferRouteEnemyDelta: 0,
          riskierRouteEnemyDelta: 0,
        },
      },
      {
        id: 'ember_hunt',
        biomeId: 'ember-fields',
        domain: 'routing_pressure',
        label: 'EMBER HUNT',
        summary: 'Riskier paths reward tempo but increase encounter density.',
        tacticalTag: 'routing',
        pressureCost: 1,
        effects: {
          enemyIntervalMultiplier: 0.96,
          saferRouteEnemyDelta: -1,
          riskierRouteEnemyDelta: 1,
        },
        blockedObjectiveKinds: ['survive'],
        blockedMutatorDomains: ['routing'],
        maxBodySpendMinLength: 3,
        downgradeToRuleId: 'ember_hunt_soft',
      },
      {
        id: 'ember_hunt_soft',
        biomeId: 'ember-fields',
        domain: 'routing_pressure',
        label: 'EMBER HUNT (SOFT)',
        summary: 'A lighter routing variant tempers branch pressure.',
        tacticalTag: 'routing',
        pressureCost: 0,
        effects: {
          saferRouteEnemyDelta: 0,
          riskierRouteEnemyDelta: 0,
        },
      },
    ] satisfies ReadonlyArray<BiomeRuleDefinition>,
  },
  rewards: {
    draftSize: 3,
    pool: [
      {
        id: 'fortified_core',
        icon: 'H',
        color: 0x6affd5,
        effects: {
          bonusShields: 1,
          moveIntervalMultiplier: 1.12,
        },
      },
      {
        id: 'volatile_fangs',
        icon: 'V',
        color: 0x8cff78,
        effects: {
          venomCharges: 2,
          enemySlowMultiplier: 0.88,
        },
      },
      {
        id: 'long_coil',
        icon: 'L',
        color: 0xffc86d,
        effects: {
          bonusLength: 2,
          maxTurnQueue: 1,
        },
      },
    ] satisfies ReadonlyArray<RewardOption>,
  },
  feedback: {
    hudPulseMs: 520,
    damage: {
      flashSeconds: 0.16,
      shakeSeconds: 0.22,
      hitStopMs: 55,
      pulseSeconds: 0.26,
      pulseRadiusCells: 1.2,
    },
    shieldDamage: {
      flashSeconds: 0.14,
      shakeSeconds: 0.18,
      hitStopMs: 34,
      pulseSeconds: 0.22,
      pulseRadiusCells: 1.02,
    },
    pickupMinor: {
      flashSeconds: 0.08,
      shakeSeconds: 0.04,
      hitStopMs: 16,
      pulseSeconds: 0.2,
      pulseRadiusCells: 0.92,
    },
    pickupMajor: {
      flashSeconds: 0.11,
      shakeSeconds: 0.06,
      hitStopMs: 24,
      pulseSeconds: 0.24,
      pulseRadiusCells: 1.08,
    },
    objectiveReady: {
      flashSeconds: 0.18,
      shakeSeconds: 0.12,
      hitStopMs: 46,
      pulseSeconds: 0.42,
      pulseRadiusCells: 2.5,
      hudPulseMs: 980,
    },
    objectiveComplete: {
      flashSeconds: 0.14,
      shakeSeconds: 0.1,
      hitStopMs: 28,
      pulseSeconds: 0.34,
      pulseRadiusCells: 1.8,
      hudPulseMs: 760,
    },
  },
  spawn: {
    powerupAtFloorStartChance: 0.4,
    powerupOnFoodChance: 0.3,
    powerupRespawnChance: 0.5,
    powerupRespawnDelayMs: 5000,
    enemyRespawnOnShieldHitChance: 0.3,
    enemyRespawnIdleChance: 0.05,
  },
  combatFairness: {
    grace: {
      roomEntryMs: 900,
      postHitMs: 700,
    },
    telegraph: {
      ambusherDashTicks: 2,
      eggHatchWarningTurns: 1,
    },
    spawn: {
      enemyMinDistanceFromPlayer: 7,
      avoidPlayerForwardLaneSteps: 3,
      minOpenNeighborCount: 2,
    },
  },
  enemyRoles: {
    byKind: {
      normal: 'blocker',
      stalker: 'leech',
      ambusher: 'charger',
      boss: 'blocker',
      egg: 'summoner',
      mirror: 'sniper',
    } satisfies Record<'normal' | 'stalker' | 'ambusher' | 'boss' | 'egg' | 'mirror', EnemyRole>,
    roleKnobs: {
      sniper: {
        telegraphTicks: 2,
        cooldownTurns: 2,
      },
      blocker: {
        pressureWeight: 1,
      },
      summoner: {
        hatchWarningTurns: 1,
      },
      charger: {
        telegraphTicks: 2,
      },
      leech: {
        feedTelegraphTicks: 1,
        scoreDrainOnFoodSteal: 4,
      },
    },
    spawnPolicy: {
      weights: {
        sniper: 0.22,
        blocker: 0.26,
        summoner: 0.18,
        charger: 0.2,
        leech: 0.14,
      } satisfies Record<EnemyRole, number>,
      maxActiveByRole: {
        sniper: 1,
        blocker: 3,
        summoner: 1,
        charger: 1,
        leech: 2,
      } satisfies Record<EnemyRole, number>,
      minSpawnGapByRole: {
        sniper: 2,
        blocker: 0,
        summoner: 2,
        charger: 2,
        leech: 1,
      } satisfies Record<EnemyRole, number>,
      fallbackRole: 'blocker' as EnemyRole,
    },
  },
  enemy: {
    scoreOnKill: 20,
    lengthBase: 2,
    lengthRandomRange: 2,
    lengthFloorStep: 3,
  },
  enemyCollision: {
    headDamageSegments: 2,
    bodyDamageSegments: 1,
    bossHeadDamageSegments: 3,
    bossBodyDamageSegments: 2,
  },
  elimination: {
    venomPowerupWeight: 3,
    venomCooldownMs: 1150,
    venomStepMs: 70,
    venomMaxTravelSteps: 22,
  },
  bodyEconomy: {
    minSpendableLength: 2,
    bodyPulseCost: 1,
    bodyPulseCooldownMs: 2600,
    bodyPulseDurationMs: 600,
    bodyPulseRadius: 1,
    rewardOverclockCost: 1,
    rewardOverclockUsesPerObjective: 1,
  },
  enemyVariants: {
    egg: {
      minFloor: 3,
      spawnChance: 0.16,
      hatchTurns: 3,
      hatchLength: 3,
      scoreOnKill: 24,
    },
    mirror: {
      minFloor: 4,
      spawnChance: 0.12,
      delaySteps: 3,
      scoreOnKill: 30,
    },
  },
  elite: {
    spawnByFloor: [
      {
        minFloor: 1,
        spawnChance: 0,
        kindWeights: {
          stalker: 1,
          ambusher: 0,
        },
      },
      {
        minFloor: 2,
        spawnChance: 0.3,
        kindWeights: {
          stalker: 1,
          ambusher: 0,
        },
      },
      {
        minFloor: 4,
        spawnChance: 0.38,
        kindWeights: {
          stalker: 0.7,
          ambusher: 0.3,
        },
      },
      {
        minFloor: 7,
        spawnChance: 0.44,
        kindWeights: {
          stalker: 0.55,
          ambusher: 0.45,
        },
      },
    ],
    stalker: {
      scoreOnKill: 35,
      speedMultiplier: 0.78,
    },
    ambusher: {
      scoreOnKill: 55,
      dashChanceWhenAligned: 0.75,
      dashSteps: 2,
      dashMinLaneDistance: 2,
      dashCooldownTurns: 3,
    },
  },
  eliteMiniboss: {
    patternWindows: {
      telegraphMinTicks: 2,
      commitMinTicks: 1,
      recoveryTicks: 2,
      warningLeadTicks: 2,
    },
    fairness: {
      reactionWindowTicksMin: 2,
      spawnMinManhattanDistance: 7,
      minEscapeNeighbors: 2,
      maxSimultaneousPressureSources: 2,
      minCadenceGapTicks: 1,
    },
    cadence: {
      startFloor: 2,
      everyNFloors: 3,
      guaranteeInEliteRooms: true,
    },
    rewardGate: {
      gateOnObjectiveCriticalOnly: true,
      objectiveCriticalRoomTypes: ['elite'] as const satisfies ReadonlyArray<RunMapRoomType>,
    },
  },
  item: {
    spawnByFloor: [
      { minFloor: 1, riftBatteryOnFoodChance: 0, portalBeaconOnFoodChance: 0 },
      { minFloor: 2, riftBatteryOnFoodChance: 0.08, portalBeaconOnFoodChance: 0.02 },
      { minFloor: 4, riftBatteryOnFoodChance: 0.14, portalBeaconOnFoodChance: 0.025 },
      { minFloor: 7, riftBatteryOnFoodChance: 0.2, portalBeaconOnFoodChance: 0.03 },
    ],
    effectDurations: {
      riftSuppressionMs: 9000,
      portalAccelerateMs: 4500,
    },
  },
  biome: {
    id: 'void-depths',
    name: 'VOID DEPTHS',
    starCount: 36,
    pressure: {
      enabled: true,
      startFloor: 2,
      intervalBaseMs: 16000,
      intervalPerFloorMs: 700,
      intervalMinMs: 7000,
      decaySegments: 1,
      coolantPerCoreItem: 1,
    },
    rift: {
      tickMs: 3200,
      scoreOnSurviveTick: 4,
    },
    coreItem: {
      spawnFloor: 2,
      spawnChanceOnFood: 0.18,
      scoreBonus: 45,
      growthBonus: 2,
    },
    boss: {
      floorInterval: 3,
      health: 3,
      length: 4,
      scoreOnDefeat: 140,
      supportShieldSpawnAtStart: true,
      supportShieldRespawnMs: 8500,
    },
  },
  food: {
    scoreOnEat: 10,
  },
  powerup: {
    scoreBonus: 30,
    slowMultiplier: 1.5,
  },
  regen: {
    intervalMs: 5000,
  },
  economy: {
    rewardScoreDivisor: 26,
    rewardKillValue: 4,
    rewardFloorValue: 8,
    rewardMin: 4,
    goals: {
      floor_5: {
        target: 5,
        reward: 35,
      },
      elite_hunter_12: {
        target: 12,
        reward: 45,
      },
    },
  },
  talents: {
    costs: {
      speed_1: 15,
      speed_2: 40,
      survival_1: 20,
      survival_2: 40,
      hunt_1: 25,
      hunt_2: 50,
    } satisfies Record<TalentId, number>,
  },
} as const

export const createBaseRunConfig = (): RunConfig => ({
  moveInterval: BALANCE.run.moveIntervalMs,
  bonusStartLength: BALANCE.run.bonusStartLength,
  bonusShields: BALANCE.run.bonusShields,
  hasMagnet: BALANCE.run.hasMagnet,
  magnetRadius: BALANCE.run.magnetRadius,
  ghostCharges: BALANCE.run.ghostCharges,
  scoreMult: BALANCE.run.scoreMult,
  powerupScoreMult: BALANCE.run.powerupScoreMult,
  powerupGrowth: BALANCE.run.powerupGrowth,
  enemySlow: BALANCE.run.enemySlow,
  hasRegen: BALANCE.run.hasRegen,
  regenIntervalMs: BALANCE.run.regenIntervalMs,
  maxTurnQueue: 2,
  bodySpendMinLength: BALANCE.bodyEconomy.minSpendableLength,
  bodyPulseCost: BALANCE.bodyEconomy.bodyPulseCost,
  bodyPulseCooldownMs: BALANCE.bodyEconomy.bodyPulseCooldownMs,
  bodyPulseDurationMs: BALANCE.bodyEconomy.bodyPulseDurationMs,
  bodyPulseRadius: BALANCE.bodyEconomy.bodyPulseRadius,
  rewardOverclockCost: BALANCE.bodyEconomy.rewardOverclockCost,
  rewardOverclockUsesPerObjective: BALANCE.bodyEconomy.rewardOverclockUsesPerObjective,
})

export type FloorSetup = {
  wallCount: number
  enemyCount: number
  snakeLengthGoal: number
  floorTemplate: FloorTemplate
  enemyIntervalMs: number
  darknessActive: boolean
  darknessRadius: number
  darknessEdgeFalloff: number
  darknessAlphaOuter: number
  darknessAlphaEdge: number
  iceActive: boolean
  iceTileCount: number
  iceSlideSteps: number
  sandActive: boolean
  sandTileCount: number
  sandMovePenaltyMs: number
}

export const getFloorSetup = (floor: number, enemySlowMultiplier = 1): FloorSetup => {
  const lerp = (from: number, to: number, t: number): number => from + (to - from) * t
  const clampedFloor = Math.max(1, Math.floor(floor))
  const isBossFloor = clampedFloor % BALANCE.biome.boss.floorInterval === 0
  const wallCount = Math.min(
    BALANCE.floor.wallBase + clampedFloor * BALANCE.floor.wallPerFloor,
    BALANCE.floor.wallCap,
  )
  const enemyCount = Math.min(
    BALANCE.floor.enemyBase + Math.floor(clampedFloor / BALANCE.floor.enemyPerFloorStep),
    BALANCE.floor.enemyCap,
  )
  const progressOffset = (clampedFloor - 1) % BALANCE.biome.boss.floorInterval
  const snakeLengthGoal = isBossFloor
    ? 0
    : BALANCE.floor.lengthGoalBase + progressOffset * BALANCE.floor.lengthGoalPerFloor
  const enemyIntervalMs =
    Math.max(
      BALANCE.floor.enemyIntervalMinMs,
      BALANCE.floor.enemyIntervalBaseMs - clampedFloor * BALANCE.floor.enemyIntervalPerFloorMs,
    ) * enemySlowMultiplier
  const darknessConfig = BALANCE.modifiers.darkness
  const iceConfig = BALANCE.modifiers.ice
  const sandConfig = BALANCE.modifiers.sand
  const roomTemplateConfig = BALANCE.floorTemplate.roomsV1
  const bossInterval = Math.max(2, BALANCE.biome.boss.floorInterval)
  const cycleStep = (clampedFloor - 1) % bossInterval
  const preBossSteps = Math.max(1, bossInterval - 1)
  const preBossProgress = preBossSteps <= 1 ? 1 : cycleStep / (preBossSteps - 1)
  const darknessActive =
    darknessConfig.enabled &&
    !isBossFloor &&
    clampedFloor >= darknessConfig.startFloor &&
    cycleStep < preBossSteps
  const iceActive =
    iceConfig.enabled &&
    !isBossFloor &&
    clampedFloor >= iceConfig.startFloor &&
    (clampedFloor - iceConfig.startFloor) % Math.max(1, iceConfig.cadence) === 0
  const sandActive =
    sandConfig.enabled &&
    !isBossFloor &&
    clampedFloor >= sandConfig.startFloor &&
    (clampedFloor - sandConfig.startFloor) % Math.max(1, sandConfig.cadence) === 0
  const darknessT = darknessActive ? Math.min(1, Math.max(0, preBossProgress)) : 0
  const iceT = iceActive ? Math.min(1, Math.max(0, preBossProgress)) : 0
  const sandT = sandActive ? Math.min(1, Math.max(0, preBossProgress)) : 0
  const floorTemplate: FloorTemplate =
    roomTemplateConfig.enabled &&
    !isBossFloor &&
    clampedFloor >= roomTemplateConfig.startFloor &&
    (clampedFloor - roomTemplateConfig.startFloor) % Math.max(1, roomTemplateConfig.cadence) === 0
      ? 'rooms_v1'
      : 'classic'

  return {
    wallCount,
    enemyCount,
    snakeLengthGoal,
    floorTemplate,
    enemyIntervalMs,
    darknessActive,
    darknessRadius: Math.round(
      lerp(darknessConfig.minVisibilityRadius, darknessConfig.maxVisibilityRadius, darknessT),
    ),
    darknessEdgeFalloff: Math.max(
      0,
      Math.round(lerp(darknessConfig.minEdgeFalloff, darknessConfig.maxEdgeFalloff, darknessT)),
    ),
    darknessAlphaOuter: lerp(darknessConfig.minAlphaOuter, darknessConfig.maxAlphaOuter, darknessT),
    darknessAlphaEdge: lerp(darknessConfig.minAlphaEdge, darknessConfig.maxAlphaEdge, darknessT),
    iceActive,
    iceTileCount: Math.round(lerp(iceConfig.minTileCount, iceConfig.maxTileCount, iceT)),
    iceSlideSteps: Math.max(0, Math.floor(iceConfig.slideSteps)),
    sandActive,
    sandTileCount: Math.round(lerp(sandConfig.minTileCount, sandConfig.maxTileCount, sandT)),
    sandMovePenaltyMs: Math.max(0, Math.floor(sandConfig.movePenaltyMs)),
  }
}
