import { rest } from 'msw'
import { API_DOMAIN, GENRES } from '../constants'
import { ContentGroup } from '../global'
import contentFeeds from './fixtures/contentFeeds.json'
import _contentGroups from './fixtures/contentGroups.json'

export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function getPageSlice(pageNumber: number, pageSize: number): [number, number] {
  return [(pageNumber - 1) * pageSize, pageNumber * pageSize]
}

export const handlers = [
  rest.get(`${API_DOMAIN}/home`, async (req, res, ctx) => {
    const pageSize = +req.url.searchParams.get('pageSize')! || 5
    const currentPage = +req.url.searchParams.get('page')! || 1
    await wait(300)

    const [start, end] = getPageSlice(currentPage, pageSize)
    const items = contentFeeds.slice(start, end)

    return res(
      ctx.status(200),
      ctx.json({
        items,
        hasMore: items[items.length - 1] !== contentFeeds[contentFeeds.length - 1],
      }),
    )
  }),
  rest.get(`${API_DOMAIN}/contentGroup/:id`, async (req, res, ctx) => {
    const contentGroups: ContentGroup[] = _contentGroups as ContentGroup[]
    const foundContentGroup = contentGroups.filter(
      (contentGroup) => contentGroup.id === +req.params.id!,
    )[0]
    await wait(300)

    if (!foundContentGroup) {
      return res(ctx.status(404), ctx.json({}))
    }

    return res(ctx.status(200), ctx.json(foundContentGroup))
  }),
  rest.get(`${API_DOMAIN}/genres`, async (req, res, ctx) => {
    await wait(300)

    return res(ctx.status(200), ctx.json(GENRES))
  }),
  rest.get(`${API_DOMAIN}/browse`, async (req, res, ctx) => {
    const contentGroups: ContentGroup[] = _contentGroups as ContentGroup[]
    const genre = req.url.searchParams.get('activeFilter') || 'all'
    const pageSize = +req.url.searchParams.get('pageSize')! || 20
    const currentPage = +req.url.searchParams.get('page')! || 1
    await wait(600)

    const [start, end] = getPageSlice(currentPage, pageSize)
    const items = contentGroups
      .filter((contentGroup) => (genre === 'all' ? true : contentGroup.genres?.includes(genre)))
      .slice(start, end)

    return res(
      ctx.status(200),
      ctx.json({
        items,
        hasMore: items[items.length - 1] !== contentGroups[contentGroups.length - 1],
      }),
    )
  }),
]
