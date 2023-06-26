import contentFeeds from "../mocks/fixtures/contentFeeds.json";
import _contentGroups from "../mocks/fixtures/contentGroups.json";

import { getPageSlice } from "./mock-helpers";

export function mockGetHomeFeedItems(pageSize: number = 5, currentPage: number = 1) {
  // wait(300);

  const [start, end] = getPageSlice(currentPage, pageSize);
  const items = contentFeeds.slice(start, end);
  return { items, hasMore: items[items.length - 1] !== contentFeeds[contentFeeds.length - 1] };
}
