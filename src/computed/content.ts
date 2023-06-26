import { ContentGroup } from '../global'

export function getContentGroupSubbedDubbed(contentGroup: ContentGroup) {
  const types = []

  if (contentGroup.subtitles?.length) {
    types.push('Sub')
  }

  if (contentGroup.additionalContentAudioTypes?.length) {
    types.push('Dub')
  }

  return types.join(' | ')
}
