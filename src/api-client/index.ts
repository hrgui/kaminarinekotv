import {
  BrowseResponse,
  ContentGroup,
  ContentItem,
  ContinueWatchingStorage,
  HomeFeed,
  ID,
  WatchHistory,
} from "../global";
import { API_DOMAIN, LOCAL_STORAGE_KEY } from "../constants";

import contentFeeds from "../mocks/fixtures/contentFeeds.json";
import _contentGroups from "../mocks/fixtures/contentGroups.json";
import { mockGetHomeFeedItems } from "./mock-handlers";

/**
 * Gets the home feed
 * @returns
 */
export async function getGenres(): Promise<string[]> {
  const res = await fetch(`${API_DOMAIN}/genres`);
  return res.json();
}

/**
 * Gets content group based on criteria.
 * @returns
 */
export async function browse(pageParam: number, activeFilter: string): Promise<BrowseResponse> {
  const res = await fetch(
    `${API_DOMAIN}/browse?page=${pageParam}&activeFilter=${encodeURIComponent(activeFilter)}`
  );
  return res.json();
}

/**
 * Gets the home feed
 * @returns
 */
export async function getHomeFeed(pageParam: number): Promise<HomeFeed> {
  // return { items: contentFeeds as any, hasMore: false };
  // // const res = await fetch(`${API_DOMAIN}/home?page=${pageParam}`)
  // // return res.json()
  console.log("getHomeFeed", pageParam);
  return mockGetHomeFeedItems(5, pageParam) as any;
}

/**
 * Returns back the content group (series or movie)
 * @param id
 * @returns
 */
export async function getContentGroup(id: number): Promise<ContentGroup> {
  // const res = await fetch(`${API_DOMAIN}/contentGroup/${id}`);
  // return res.json();
  console.log("getContentGroups", _contentGroups.find((cg) => cg.id === id) as any);
  return _contentGroups.find((cg) => cg.id === id) as any;
}

/**
 * Returns back the content item (the actual episode)
 * @param contentGroupId
 * @param itemId
 * @returns
 */
export async function getContentItem(
  contentGroupId: number,
  itemId: string
): Promise<ContentItem & { contentGroup: ContentGroup }> {
  const contentGroup = await getContentGroup(contentGroupId);
  const item = contentGroup.items.filter((item) => item.id === itemId)[0];
  return { ...item, contentGroup };
}

/**
 * Gets the continue watching as a map. Does not dedupe, and its keyed by contentitem.id
 * @returns
 */
export function getContinueWatching(): ContinueWatchingStorage {
  const rawJson = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return JSON.parse(rawJson as string) || {};
  } catch (e) {
    console.warn("getContinueWatching: failed to get from local storage, reverting back to []", e);
    return {};
  }
}

function dedupeWatchHistoryByGroup(watchHistory: WatchHistory) {
  const watchHistoryBySeries: ContinueWatchingStorage = watchHistory.reduce(
    (_watchHistoryBySeries, historyItem) => {
      if (_watchHistoryBySeries[historyItem.contentGroup.id]) {
        // already have it, so check current
        const currentUpdatedDate = historyItem?.updatedDate || 0;
        const whatsStoredUpdatedDate =
          _watchHistoryBySeries?.[historyItem.contentGroup.id]?.updatedDate || 0;

        if (currentUpdatedDate >= whatsStoredUpdatedDate) {
          _watchHistoryBySeries[historyItem.contentGroup.id] = historyItem;
        }
      } else {
        _watchHistoryBySeries[historyItem.contentGroup.id] = historyItem;
      }

      return _watchHistoryBySeries;
    },
    {} as ContinueWatchingStorage
  );

  return Object.values(watchHistoryBySeries);
}

/**
 * Gets continue watching list.
 * @param ended Filters out everything has ended
 * @param dedupeByGroup Reduces the continue watching list to be just by series
 * @returns
 */
export function getWatchHistory(ended = false, dedupeByGroup = true): WatchHistory {
  let continueWatching = Object.values(getContinueWatching());

  if (!ended) {
    continueWatching = continueWatching.filter((x) => !x.isEnd);
  }

  if (dedupeByGroup) {
    continueWatching = dedupeWatchHistoryByGroup(continueWatching);
  }

  // sort by updatedDate
  continueWatching.sort((a, b) => {
    const aUpdatedDate = a.updatedDate || 0;
    const bUpdatedDate = b.updatedDate || 0;
    return bUpdatedDate - aUpdatedDate;
  });

  return continueWatching;
}

export function getGroupWatchHistory(contentGroupId: ID) {
  return getWatchHistory(true, false).filter(
    ({ contentGroup }) => contentGroup.id === contentGroupId
  );
}

export function updateContinueWatching(
  item: ContentItem & { contentGroup: ContentGroup },
  playheadMetadata: number,
  totalDuration: number,
  isEnd?: boolean
) {
  const json = getContinueWatching();
  json[item.id] = {
    ...item,
    playheadMetadata,
    totalDuration,
    isEnd,
    updatedDate: Date.now(),
  };

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));

  return json;
}
