export type ID = string | number

export interface HomeFeed {
  items: ContentFeed[]
  hasMore: boolean
}

export interface BrowseResponse {
  items: ContentGroup[]
  hasMore: boolean
}

export type ContentFeedContent = {
  items: ContentGroup[]
}

export type ContentFeed = {
  id: ID
  title: string
  description: string
  type: 'hero' | 'mini-hero' | 'continue-watching' | 'carousel'
} & ContentFeedContent

export type ContentAudioType = {
  /** Audio type */
  id: ID
  /** Name of the audio (Display) */
  name: string
}

export type ContentSubtitleType = {
  /** Subtitle ID */
  id: ID
  /** Name of subtitle (Display) */
  name: string
  /** Audio type ID it links to. If not present, then it will mean it's for the original  */
  audioTypeId?: ID
}

export type ContentMetadata = {
  /** What the original audio source audio is from */
  originalAudioType: ContentAudioType
  /** Presence of this indicates dubbed  */
  additionalContentAudioTypes?: ContentAudioType[]
  /** Presence of this with audioType = null or matches original audio type indicates it has subtitles */
  subtitles?: ContentSubtitleType[]
}

/** Could represent a series or movie */
export type ContentGroup = {
  id: ID
  title: string
  description: string
  type: 'series' | 'movie'
  items: ContentItem[]
  images?: ContentGroupImages
  genres?: string[]
} & ContentMetadata

export type Source = {
  source: 'youtube'
  metadata: {
    url: string
    totalDuration: number
  }
}

export type ContentGroupImages = {
  /** skyscraper format: 150x225 */
  asFeed: string
  /** 16/9 format: 1200x675 */
  asPageHeader: string
}

export type ContentItem = {
  id: ID
  title: string
  description: string
  seasonNumber?: number
  /** 240 x 135 */
  image: string
  source: Source
  itemNumber?: number
}

export type ContinueWatching = {
  [contentGroupId: string]: ContentItem & {
    contentGroup: ContentGroup
    playheadMetadata: number
    totalDuration: number
    isEnd?: boolean
  }
}

export type ContinueWatchingItem = ContentItem & {
  contentGroup: ContentGroup
  /** Position of where playhead has started */
  playheadMetadata: number
  /** Total duration of the video */
  totalDuration: number
  /** If true, user has ended watching this video */
  isEnd?: boolean
  /** This also serves as a created date. Timestamp of when this item was last updated. */
  updatedDate?: number
}

/** What the user has watched, keyed by Content Item ID. This is what is stored in the data.  */
export type ContinueWatchingStorage = { [itemId: ID]: ContinueWatchingItem }
/** What the user has watched, in array format - updatedDate ASC. This is computed. */
export type WatchHistory = ContinueWatchingItem[]

export type NextItem = ContentItem & { contentGroup: ContentGroup }
