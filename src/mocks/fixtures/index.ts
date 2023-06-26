import { ContentFeed, ContentGroup, ContentItem, NextItem } from "~/global";
import _contentGroups from "./contentGroups.json";
import _contentFeeds from "./contentFeeds.json";
import merge from "lodash.merge";

// string is not equal to type "series" | "movie"
const contentGroups = _contentGroups as ContentGroup[];
const contentFeeds = _contentFeeds as ContentFeed[];

export function createContentGroupFixture(
  overrides?: Partial<ContentGroup>
): ContentGroup {
  return merge(contentGroups[0], overrides);
}

export function createContentFeedFixture(
  overrides?: Partial<ContentFeed>
): ContentFeed {
  return merge(contentFeeds[0], overrides);
}

export function createContentItemFixture(
  overrides?: Partial<ContentItem>
): ContentItem {
  return merge(contentGroups[0].items[0], overrides);
}

export function createNextItemFixture(overrides?: Partial<NextItem>) {
  const contentGroup = contentGroups[0];
  return merge(contentGroup.items[0], { contentGroup }, overrides);
}
