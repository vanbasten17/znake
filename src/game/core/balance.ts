import type {
  BiomeId,
  BiomeRuleDefinition,
  ChallengeMutatorDefinition,
  DepthBalanceBandId,
  EnemyRole,
  EventChoiceConsequenceDefinition,
  EventChoiceDefinition,
  FloorObjectiveKind,
  FloorTemplate,
  GoalId,
  NonBossObjectiveKind,
  PowerupType,
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
  depthBalance: {
    boundedFloorMin: 1,
    boundedFloorMax: 15,
    bands: [
      {
        id: 'early',
        minFloor: 1,
        maxFloor: 5,
        rolePolicyId: 'early',
        itemProfileId: 'early',
        pressure: {
          enemyCountBonus: 0,
          enemyIntervalMultiplier: 1,
        },
        guardrails: {
          enemyCountDeltaMin: 0,
          enemyCountDeltaMax: 1,
          enemyIntervalDropMinMs: 6,
          enemyIntervalDropMaxMs: 36,
        },
      },
      {
        id: 'mid',
        minFloor: 6,
        maxFloor: 10,
        rolePolicyId: 'mid',
        itemProfileId: 'mid',
        pressure: {
          enemyCountBonus: 1,
          enemyIntervalMultiplier: 0.95,
        },
        guardrails: {
          enemyCountDeltaMin: 0,
          enemyCountDeltaMax: 1,
          enemyIntervalDropMinMs: 8,
          enemyIntervalDropMaxMs: 42,
        },
      },
      {
        id: 'late',
        minFloor: 11,
        maxFloor: 15,
        rolePolicyId: 'late',
        itemProfileId: 'late',
        pressure: {
          enemyCountBonus: 1,
          enemyIntervalMultiplier: 0.91,
        },
        guardrails: {
          enemyCountDeltaMin: 0,
          enemyCountDeltaMax: 1,
          enemyIntervalDropMinMs: 10,
          enemyIntervalDropMaxMs: 46,
        },
      },
    ] as const satisfies ReadonlyArray<{
      id: DepthBalanceBandId
      minFloor: number
      maxFloor: number
      rolePolicyId: 'early' | 'mid' | 'late'
      itemProfileId: 'early' | 'mid' | 'late'
      pressure: {
        enemyCountBonus: number
        enemyIntervalMultiplier: number
      }
      guardrails: {
        enemyCountDeltaMin: number
        enemyCountDeltaMax: number
        enemyIntervalDropMinMs: number
        enemyIntervalDropMaxMs: number
      }
    }>,
    roleSpawnPolicyById: {
      early: {
        weights: {
          sniper: 0.2,
          blocker: 0.3,
          summoner: 0.16,
          charger: 0.18,
          leech: 0.16,
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
      mid: {
        weights: {
          sniper: 0.24,
          blocker: 0.24,
          summoner: 0.19,
          charger: 0.21,
          leech: 0.12,
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
      late: {
        weights: {
          sniper: 0.28,
          blocker: 0.2,
          summoner: 0.22,
          charger: 0.22,
          leech: 0.08,
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
    } as const,
    roleCompositionDirectorById: {
      early: {
        windowSizeSpawns: 3,
        windows: [
          {
            id: 'early_stable',
            weightMultipliers: {
              blocker: 1.1,
              charger: 0.9,
              summoner: 0.9,
            },
          },
          {
            id: 'early_poke',
            weightMultipliers: {
              sniper: 1.2,
              blocker: 0.9,
            },
          },
        ],
      },
      mid: {
        windowSizeSpawns: 3,
        windows: [
          {
            id: 'mid_mix',
            weightMultipliers: {
              blocker: 1,
              charger: 1,
            },
          },
          {
            id: 'mid_pressure',
            weightMultipliers: {
              charger: 1.2,
              summoner: 1.1,
              blocker: 0.88,
            },
          },
        ],
      },
      late: {
        windowSizeSpawns: 2,
        windows: [
          {
            id: 'late_spike',
            weightMultipliers: {
              sniper: 1.2,
              summoner: 1.2,
              blocker: 0.85,
            },
            maxActiveByRole: {
              blocker: 2,
            },
          },
          {
            id: 'late_recover',
            weightMultipliers: {
              blocker: 1.2,
              leech: 1.2,
              charger: 0.9,
            },
            maxActiveByRole: {
              blocker: 3,
            },
          },
        ],
      },
    } as const,
    itemUsefulnessProfiles: {
      early: {
        riftBatteryMultiplier: 0.88,
        portalBeaconMultiplier: 1.08,
        objectiveMultiplier: {
          portal: 1.1,
          score: 1,
          kills: 0.95,
          boss: 1.05,
        } satisfies Record<FloorObjectiveKind, number>,
        portalNoPortalBoostMultiplier: 1.1,
      },
      mid: {
        riftBatteryMultiplier: 1.05,
        portalBeaconMultiplier: 1,
        objectiveMultiplier: {
          portal: 1.05,
          score: 1.04,
          kills: 1,
          boss: 1.04,
        } satisfies Record<FloorObjectiveKind, number>,
        portalNoPortalBoostMultiplier: 1.12,
      },
      late: {
        riftBatteryMultiplier: 1.2,
        portalBeaconMultiplier: 0.95,
        objectiveMultiplier: {
          portal: 1,
          score: 1.08,
          kills: 1.06,
          boss: 1.06,
        } satisfies Record<FloorObjectiveKind, number>,
        portalNoPortalBoostMultiplier: 1.14,
      },
    } as const,
    powerupWeightsByItemProfile: {
      early: {
        standard: {
          shield: 2.2,
          slow: 1.7,
          ghost: 1.3,
          score: 1.2,
          venom: 0.2,
        } satisfies Record<PowerupType, number>,
        kills: {
          shield: 1.6,
          slow: 1.6,
          ghost: 1.1,
          score: 1,
          venom: 2.8,
        } satisfies Record<PowerupType, number>,
        boss: {
          shield: 2.2,
          slow: 1.4,
          ghost: 1.1,
          score: 0.8,
          venom: 2,
        } satisfies Record<PowerupType, number>,
      },
      mid: {
        standard: {
          shield: 2,
          slow: 1.6,
          ghost: 1.4,
          score: 1.3,
          venom: 0.28,
        } satisfies Record<PowerupType, number>,
        kills: {
          shield: 1.5,
          slow: 1.5,
          ghost: 1.2,
          score: 1.1,
          venom: 3,
        } satisfies Record<PowerupType, number>,
        boss: {
          shield: 2,
          slow: 1.3,
          ghost: 1.2,
          score: 0.85,
          venom: 2.1,
        } satisfies Record<PowerupType, number>,
      },
      late: {
        standard: {
          shield: 1.8,
          slow: 1.4,
          ghost: 1.5,
          score: 1.5,
          venom: 0.34,
        } satisfies Record<PowerupType, number>,
        kills: {
          shield: 1.4,
          slow: 1.4,
          ghost: 1.2,
          score: 1.2,
          venom: 3.2,
        } satisfies Record<PowerupType, number>,
        boss: {
          shield: 1.9,
          slow: 1.25,
          ghost: 1.25,
          score: 0.9,
          venom: 2.2,
        } satisfies Record<PowerupType, number>,
      },
    } as const,
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
        packageId: 'safe_economy',
        packageLabel: 'SAFE ECONOMY',
        packageTag: 'recover',
        enemyDelta: -1,
        wallDelta: -1,
        enemyIntervalMultiplier: 1.12,
        scoreBonus: 8,
      },
      riskier: {
        packageId: 'high_risk_tempo',
        packageLabel: 'HIGH-RISK TEMPO',
        packageTag: 'spike',
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
    consequenceMemory: {
      maxPending: 2,
      definitions: [
        {
          id: 'safe_cache_followup',
          sourceOptionId: 'route_safe_guarded',
          minDelayFloors: 1,
          maxDelayFloors: 2,
          summaryKey: 'game.eventChoiceConsequence.safeCache',
          effects: {
            shieldDelta: 1,
            scoreDelta: 10,
          },
        },
        {
          id: 'risk_overheat_followup',
          sourceOptionId: 'route_risk_hunt',
          minDelayFloors: 2,
          maxDelayFloors: 3,
          summaryKey: 'game.eventChoiceConsequence.riskOverheat',
          effects: {
            enemyIntervalMultiplier: 0.95,
            moveIntervalMultiplier: 0.97,
            scoreDelta: 14,
          },
        },
      ] satisfies ReadonlyArray<EventChoiceConsequenceDefinition>,
    },
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
      unlockMode: 'any' as const,
      unlockByGoalProgress: {
        floor_5: 5,
        elite_hunter_12: 6,
      } as const satisfies Record<GoalId, number>,
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
      roomEntryMs: 1150,
      postHitMs: 850,
    },
    telegraph: {
      ambusherDashTicks: 3,
      eggHatchWarningTurns: 2,
    },
    spawn: {
      enemyMinDistanceFromPlayer: 8,
      avoidPlayerForwardLaneSteps: 4,
      minOpenNeighborCount: 3,
    },
  },
  predatorPreyPacing: {
    phaseTicks: {
      openingHunt: 4,
      hunt: 4,
      escape: 3,
      reset: 2,
    },
    guardrails: {
      maxConcurrentPressureSources: 2,
      minTicksBetweenPressureActions: 2,
      fallbackAction: 'defer',
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
        telegraphTicks: 3,
        cooldownTurns: 2,
      },
      blocker: {
        pressureWeight: 1,
      },
      summoner: {
        hatchWarningTurns: 2,
      },
      charger: {
        telegraphTicks: 3,
      },
      leech: {
        feedTelegraphTicks: 2,
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
  bodyTerrain: {
    zoneRadius: 2,
    laneDistance: 4,
    guardrails: {
      minSafePocketNeighbors: 1,
      pressureSourceThreshold: 1,
    },
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
      telegraphMinTicks: 3,
      commitMinTicks: 1,
      recoveryTicks: 2,
      warningLeadTicks: 3,
    },
    fairness: {
      reactionWindowTicksMin: 3,
      spawnMinManhattanDistance: 8,
      minEscapeNeighbors: 3,
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
      identity: {
        id: 'void_apex',
        cueLabel: 'VOID APEX',
      },
      fairness: {
        reactionWindowTicksMin: 2,
        maxSimultaneousPressureSources: 2,
      },
      supportShieldSpawnAtStart: true,
      supportShieldRespawnMs: 8500,
      phaseRemixById: {
        standard: {
          cueLabel: 'STANDARD',
          rageHealthThreshold: 1,
          supportShieldRespawnMs: 8500,
        },
        assault: {
          cueLabel: 'ASSAULT',
          rageHealthThreshold: 2,
          supportShieldRespawnMs: 7600,
        },
        siege: {
          cueLabel: 'SIEGE',
          rageHealthThreshold: 1,
          supportShieldRespawnMs: 9400,
        },
      },
      phaseRemixRotation: ['standard', 'assault', 'siege'] as const,
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

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const toFloorNumber = (value: number): number => Math.max(1, Math.floor(value))

const resolveDepthBandConfig = (floor: number): (typeof BALANCE.depthBalance.bands)[number] => {
  const normalizedFloor = toFloorNumber(floor)
  return (
    BALANCE.depthBalance.bands.find(
      (band) => normalizedFloor >= band.minFloor && normalizedFloor <= band.maxFloor,
    ) ?? BALANCE.depthBalance.bands[BALANCE.depthBalance.bands.length - 1]
  )
}

const getBaseEnemyCountForFloor = (floor: number): number =>
  Math.min(
    BALANCE.floor.enemyBase + Math.floor(toFloorNumber(floor) / BALANCE.floor.enemyPerFloorStep),
    BALANCE.floor.enemyCap,
  )

const getBaseEnemyIntervalForFloor = (floor: number, enemySlowMultiplier: number): number =>
  Math.max(
    BALANCE.floor.enemyIntervalMinMs,
    BALANCE.floor.enemyIntervalBaseMs -
      toFloorNumber(floor) * BALANCE.floor.enemyIntervalPerFloorMs,
  ) * enemySlowMultiplier

type RawDepthPressure = {
  enemyCount: number
  enemyIntervalMs: number
}

const getRawDepthPressureForFloor = (
  floor: number,
  enemySlowMultiplier: number,
): RawDepthPressure => {
  const depthBand = resolveDepthBandConfig(floor)
  const enemyCount = clamp(
    getBaseEnemyCountForFloor(floor) + depthBand.pressure.enemyCountBonus,
    1,
    BALANCE.floor.enemyCap,
  )
  const enemyIntervalMs = Math.max(
    BALANCE.floor.enemyIntervalMinMs,
    getBaseEnemyIntervalForFloor(floor, enemySlowMultiplier) *
      depthBand.pressure.enemyIntervalMultiplier,
  )
  return { enemyCount, enemyIntervalMs }
}

export const getDepthBandForFloor = (floor: number): DepthBalanceBandId =>
  resolveDepthBandConfig(floor).id

export const getBossPhaseRemixForFloor = (floor: number) => {
  const normalizedFloor = toFloorNumber(floor)
  const interval = Math.max(1, BALANCE.biome.boss.floorInterval)
  const rotation = BALANCE.biome.boss.phaseRemixRotation
  const bossOrdinal = Math.max(0, Math.floor((normalizedFloor - 1) / interval))
  const remixId = rotation[bossOrdinal % rotation.length] ?? rotation[0]
  return {
    id: remixId,
    ...BALANCE.biome.boss.phaseRemixById[remixId],
  }
}

export const getRoleSpawnPolicyForFloor = (floor: number) =>
  BALANCE.depthBalance.roleSpawnPolicyById[resolveDepthBandConfig(floor).rolePolicyId]

const applyRoleWeightMultipliers = (
  weights: Record<EnemyRole, number>,
  multipliers: Partial<Record<EnemyRole, number>>,
): Record<EnemyRole, number> => ({
  sniper: Math.max(0, weights.sniper * (multipliers.sniper ?? 1)),
  blocker: Math.max(0, weights.blocker * (multipliers.blocker ?? 1)),
  summoner: Math.max(0, weights.summoner * (multipliers.summoner ?? 1)),
  charger: Math.max(0, weights.charger * (multipliers.charger ?? 1)),
  leech: Math.max(0, weights.leech * (multipliers.leech ?? 1)),
})

export const getRoleSpawnPolicyWindowForFloor = (params: { floor: number; spawnIndex: number }) => {
  const band = resolveDepthBandConfig(params.floor)
  const base = BALANCE.depthBalance.roleSpawnPolicyById[band.rolePolicyId]
  const director = BALANCE.depthBalance.roleCompositionDirectorById[band.rolePolicyId]
  const windows = director.windows
  const normalizedSpawnIndex = Math.max(1, Math.floor(params.spawnIndex))
  const windowIndex =
    Math.floor((normalizedSpawnIndex - 1) / director.windowSizeSpawns) % windows.length
  const window = windows[windowIndex] ?? windows[0]
  const maxActiveByRole =
    'maxActiveByRole' in window && window.maxActiveByRole ? window.maxActiveByRole : undefined
  const maxActiveOverride = (role: EnemyRole): number | undefined =>
    maxActiveByRole && role in maxActiveByRole
      ? (maxActiveByRole as Partial<Record<EnemyRole, number>>)[role]
      : undefined
  return {
    id: window.id,
    policy: {
      ...base,
      weights: applyRoleWeightMultipliers(base.weights, window.weightMultipliers),
      maxActiveByRole: {
        sniper: maxActiveOverride('sniper') ?? base.maxActiveByRole.sniper,
        blocker: maxActiveOverride('blocker') ?? base.maxActiveByRole.blocker,
        summoner: maxActiveOverride('summoner') ?? base.maxActiveByRole.summoner,
        charger: maxActiveOverride('charger') ?? base.maxActiveByRole.charger,
        leech: maxActiveOverride('leech') ?? base.maxActiveByRole.leech,
      },
    },
  }
}

export const getPowerupWeightProfileForFloor = (params: {
  floor: number
  pool: 'standard' | 'kills' | 'boss'
}): Record<PowerupType, number> =>
  BALANCE.depthBalance.powerupWeightsByItemProfile[
    resolveDepthBandConfig(params.floor).itemProfileId
  ][params.pool]

const clampChance = (value: number): number => clamp(value, 0, 1)

export const getItemSpawnConfigForFloor = (params: {
  floor: number
  objectiveType: FloorObjectiveKind
  hasOpenPortals: boolean
}): { riftBatteryOnFoodChance: number; portalBeaconOnFoodChance: number } => {
  const floor = toFloorNumber(params.floor)
  const sorted = [...BALANCE.item.spawnByFloor].sort((a, b) => b.minFloor - a.minFloor)
  const base = sorted.find((config) => floor >= config.minFloor) ?? BALANCE.item.spawnByFloor[0]
  const profile =
    BALANCE.depthBalance.itemUsefulnessProfiles[resolveDepthBandConfig(floor).itemProfileId]
  const objectiveMultiplier = profile.objectiveMultiplier[params.objectiveType]
  const portalBoost =
    params.objectiveType === 'portal' && !params.hasOpenPortals
      ? profile.portalNoPortalBoostMultiplier
      : 1
  return {
    riftBatteryOnFoodChance: clampChance(
      base.riftBatteryOnFoodChance * profile.riftBatteryMultiplier * objectiveMultiplier,
    ),
    portalBeaconOnFoodChance: clampChance(
      base.portalBeaconOnFoodChance *
        profile.portalBeaconMultiplier *
        objectiveMultiplier *
        portalBoost,
    ),
  }
}

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
  const rawDepthPressure = getRawDepthPressureForFloor(clampedFloor, enemySlowMultiplier)
  let enemyCount = Math.round(rawDepthPressure.enemyCount)
  const progressOffset = (clampedFloor - 1) % BALANCE.biome.boss.floorInterval
  const snakeLengthGoal = isBossFloor
    ? 0
    : BALANCE.floor.lengthGoalBase + progressOffset * BALANCE.floor.lengthGoalPerFloor
  let enemyIntervalMs = rawDepthPressure.enemyIntervalMs
  if (!isBossFloor && clampedFloor > 1) {
    const previousRaw = getRawDepthPressureForFloor(clampedFloor - 1, enemySlowMultiplier)
    const guardrails = resolveDepthBandConfig(clampedFloor).guardrails
    const minEnemyCount = clamp(
      previousRaw.enemyCount + guardrails.enemyCountDeltaMin,
      1,
      BALANCE.floor.enemyCap,
    )
    const maxEnemyCount = clamp(
      previousRaw.enemyCount + guardrails.enemyCountDeltaMax,
      minEnemyCount,
      BALANCE.floor.enemyCap,
    )
    enemyCount = Math.round(clamp(enemyCount, minEnemyCount, maxEnemyCount))

    const minDrop = Math.max(0, guardrails.enemyIntervalDropMinMs)
    const maxDrop = Math.max(minDrop, guardrails.enemyIntervalDropMaxMs)
    const minInterval = Math.max(
      BALANCE.floor.enemyIntervalMinMs,
      previousRaw.enemyIntervalMs - maxDrop,
    )
    const maxInterval = Math.max(minInterval, previousRaw.enemyIntervalMs - minDrop)
    enemyIntervalMs = clamp(enemyIntervalMs, minInterval, maxInterval)
  }
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
