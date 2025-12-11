export type EmojiOption = {
  char: string
  keywords: string[]
}

// Shared professional emoji palette for values + perks
export const PROFESSIONAL_EMOJIS: EmojiOption[] = [
  { char: '✨', keywords: ['sparkle', 'delight', 'value'] },
  { char: '🚀', keywords: ['growth', 'launch', 'velocity'] },
  { char: '💡', keywords: ['idea', 'learning', 'insight'] },
  { char: '🤝', keywords: ['collaboration', 'team', 'support'] },
  { char: '🌱', keywords: ['growth', 'environment'] },
  { char: '🎯', keywords: ['focus', 'ownership', 'impact'] },
  { char: '❤️', keywords: ['care', 'people', 'support'] },
  { char: '🔥', keywords: ['ambition', 'energy'] },
  { char: '🌈', keywords: ['diversity', 'inclusion'] },
  { char: '⚡️', keywords: ['speed', 'action'] },
  { char: '🧠', keywords: ['learning', 'curiosity'] },
  { char: '📚', keywords: ['education', 'knowledge'] },
  { char: '📈', keywords: ['performance', 'results'] },
  { char: '🛡️', keywords: ['trust', 'safety'] },
  { char: '🏆', keywords: ['excellence', 'achievement'] },
  { char: '🎉', keywords: ['celebration', 'culture'] },
  { char: '🏖️', keywords: ['vacation', 'time off'] },
  { char: '🩺', keywords: ['health', 'benefits'] },
  { char: '🎓', keywords: ['learning', 'stipend'] },
  { char: '🧑‍💻', keywords: ['engineering', 'remote'] },
]

