type CopyTranslator = (key: string, vars?: Record<string, unknown>) => string

const FALLBACK_COPY_PROMPT_TITLE = 'Copy challenge code'
const FALLBACK_PASTE_PROMPT_TITLE = 'Paste challenge code'

const resolveLocalizedLabel = (
  translator: CopyTranslator,
  key: string,
  fallback: string,
): string => {
  const localized = translator(key)
  if (localized.trim().length <= 0 || localized === key) {
    return fallback
  }
  return localized
}

export const resolveChallengeSharePromptCopy = (
  translator: CopyTranslator,
): {
  copyPromptTitle: string
  pastePromptTitle: string
} => ({
  copyPromptTitle: resolveLocalizedLabel(
    translator,
    'menu.challengeShareCopyPromptTitle',
    FALLBACK_COPY_PROMPT_TITLE,
  ),
  pastePromptTitle: resolveLocalizedLabel(
    translator,
    'menu.challengeSharePastePromptTitle',
    FALLBACK_PASTE_PROMPT_TITLE,
  ),
})
